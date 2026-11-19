'use strict';
/* Spellmaster accounts. Not activated unless DATABASE_URL is configured.
 * Avoid logging passwords, bearer credentials or sensitive profile data.
 */
const crypto=require('node:crypto');
const {Pool}=require('pg');
const SECURITY=require('./account-security.js');
const PILOT_MODE=process.env.SPELLMASTER_PILOT_MODE||'';
const ADULT_PILOT=PILOT_MODE==='adult',GUARDIAN_PILOT=PILOT_MODE==='guardian';
const pool=process.env.DATABASE_URL?new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==='disable'?false:{rejectUnauthorized:true},max:5}):null;
const VALID_CONDITIONS=new Set(['dyslexia','adhd','autism','dcd','dyscalculia','dld','tourette','other']);
const VALID_AVATARS=new Set(['fox','owl','dragon','star']);
const VALID_THEMES=new Set(['auto','wonder','explorer','adventure','focus']);
const VALID_CHOICES=new Set(['selected','none','unsure','prefer_not_to_say','not_supplied']);
function send(res,status,body,extra={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra});res.end(JSON.stringify(body));}
function inputError(message,status=400){const error=new Error(message);error.status=status;return error;}
function username(s){s=String(s||'').trim().toLowerCase();if(!/^[a-z][a-z0-9_-]{3,29}$/.test(s))throw inputError('Choose a username of 4–30 letters, numbers, hyphens or underscores, starting with a letter.');return s;}
function password(s){if(typeof s!=='string'||s.length<12||Buffer.byteLength(s)>256)throw inputError('Use a password of at least 12 characters.');return s;}
function hashPassword(secret){const salt=crypto.randomBytes(16).toString('hex');return 'scrypt$'+salt+'$'+crypto.scryptSync(secret,salt,64,{N:16384,r:8,p:1}).toString('hex');}
function verifyPassword(secret,encoded){try{const [scheme,salt,expected]=encoded.split('$');if(scheme!=='scrypt'||!(/^[0-9a-f]{32}$/.test(salt))||!(/^[0-9a-f]{128}$/.test(expected)))return false;return crypto.timingSafeEqual(crypto.scryptSync(secret,salt,64,{N:16384,r:8,p:1}),Buffer.from(expected,'hex'));}catch{return false;}}
function tokenHash(token){return crypto.createHash('sha256').update(token).digest('hex');}
function newToken(){return crypto.randomBytes(32).toString('base64url');}
function uuid(){return crypto.randomUUID();}
function conditionInput(conditions,choice){if(!VALID_CHOICES.has(choice))throw inputError('Invalid condition preference.');if(!Array.isArray(conditions)||conditions.length>VALID_CONDITIONS.size)throw inputError('Invalid condition choices.');if(choice!=='selected'&&conditions.length)throw inputError('Please choose either conditions or a different preference.');if(choice==='selected'&&!conditions.length)throw inputError('Choose at least one condition.');const seen=new Set();return conditions.map(item=>{const code=String(item?.code||'');const status=item?.status;if(!VALID_CONDITIONS.has(code)||!['suspected','diagnosed'].includes(status)||seen.has(code))throw inputError('Invalid or repeated condition selection.');seen.add(code);return {code,status};});}
function choiceNeverNeeded(obj){return obj?.conditions?.length>0||obj?.conditionChoice==='selected'||obj?.supportConsent===true||obj?.analysisConsent===true}
function learnerInput(obj,kind){const alias=String(obj?.alias||'').trim();if(alias.length<2||alias.length>32||/[<>\x00-\x1f]/.test(alias))throw inputError('Use a nickname of 2–32 characters.');const birth=obj?.birthMonth||null;const age=obj?.ageYears==null?null:Number(obj.ageYears);if(birth&&(!/^(19|20)\d{2}-(0[1-9]|1[0-2])$/.test(birth)||birth>new Date().toISOString().slice(0,7)))throw inputError('Invalid birth month.');const avatar=obj?.avatar||'fox';if(!VALID_AVATARS.has(avatar))throw inputError('Invalid avatar.');const theme=obj?.theme||'auto';if(!VALID_THEMES.has(theme))throw inputError('Invalid theme.');const isChild=kind==='guardian'?true:obj?.isChild===true;
 if(age!==null&&(!Number.isInteger(age)||age<4||age>17))throw inputError('Choose an age between 4 and 17.');
 if(isChild&&GUARDIAN_PILOT&&(age===null||birth!==null))throw inputError('Choose the learner’s age in years, without a date of birth.');
 if(isChild&&GUARDIAN_PILOT&&(choiceNeverNeeded(obj)))throw inputError('Please do not provide diagnosis information in this trial.');if(kind==='adult'&&isChild)throw inputError('Child profiles require a guardian account.');const choice=obj?.conditionChoice||'not_supplied';const conditions=conditionInput(obj?.conditions||[],choice);const supportConsent=obj?.supportConsent===true,analysisConsent=obj?.analysisConsent===true;if(choice==='selected'&&!supportConsent)throw inputError('Explicit learning-support consent is required for optional condition information.');if(analysisConsent&&!supportConsent)throw inputError('Research consent requires learning-support consent.');return {alias,birth,age,avatar,theme,isChild,choice,conditions,supportConsent,analysisConsent};}
async function createLearner(client,accountId,obj,kind){const p=learnerInput(obj,kind),id=uuid();await client.query('INSERT INTO learners(id,account_id,alias,is_child,birth_month,avatar,theme,age_years,guardian_pilot_consent_at,guardian_pilot_consent_version) VALUES($1,$2,$3,$4,$5,$6,$7,$8,CASE WHEN $9 THEN now() ELSE NULL END,CASE WHEN $9 THEN $10 ELSE NULL END)',
 [id,accountId,p.alias,p.isChild,p.birth,p.avatar,p.theme,p.age,GUARDIAN_PILOT&&kind==='guardian','guardian-pilot-v1']);await client.query("INSERT INTO learner_preferences(learner_id,choice,support_consent_at,analysis_consent_at,consent_text_version) VALUES($1,$2,CASE WHEN $3 THEN now() ELSE NULL END,CASE WHEN $4 THEN now() ELSE NULL END,CASE WHEN $3 THEN 'v1' ELSE NULL END)",[id,p.choice,p.supportConsent,p.analysisConsent]);for(const x of p.conditions)await client.query('INSERT INTO learner_conditions(learner_id,condition_code,report_status) VALUES($1,$2,$3)',[id,x.code,x.status]);return {id,alias:p.alias,isChild:p.isChild,birthMonth:p.birth,ageYears:p.age,avatar:p.avatar,theme:p.theme};}
async function session(client,accountId){const token=newToken();await client.query('INSERT INTO sessions(token_hash,account_id,expires_at) VALUES($1,$2,now()+interval \'7 days\')',[tokenHash(token),accountId]);return token;}
async function readBody(req,maxBytes=65536){let data='',size=0;for await(const chunk of req){size+=chunk.length;if(size>maxBytes)throw inputError('Request too large.',413);data+=chunk;}try{const value=JSON.parse(data||'{}');if(!value||typeof value!=='object'||Array.isArray(value))throw Error('object expected');return value;}catch{throw inputError('Invalid JSON request.');}}
async function identify(req){const auth=req.headers.authorization||'';if(!/^Bearer [A-Za-z0-9_-]{43}$/.test(auth))throw inputError('Please sign in first.',401);const token=auth.slice(7);const r=await pool.query("SELECT a.id,a.username,a.kind FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=$1 AND s.expires_at>now() AND a.disabled_at IS NULL",[tokenHash(token)]);if(!r.rowCount)throw inputError('Your session has expired. Please sign in again.',401);return {...r.rows[0],token};}
async function owns(accountId,learnerId){if(!/^[0-9a-f-]{36}$/i.test(learnerId||''))throw inputError('Invalid learner.');const q=await pool.query('SELECT id,alias,is_child AS "isChild",birth_month AS "birthMonth",age_years AS "ageYears",avatar,theme FROM learners WHERE id=$1 AND account_id=$2',[learnerId,accountId]);if(!q.rowCount)throw inputError('Learner not found.',404);return q.rows[0];}
function publicAccount(a){return {id:a.id,username:a.username,kind:a.kind};}
async function execute(req,res,path){if(!path.startsWith('/api/account/'))return false;
 const origin=req.headers.origin||'';
 const approved=new Set(['https://spellquest-staging.onrender.com',process.env.APP_ORIGIN].filter(Boolean));
 const headers={'Access-Control-Allow-Origin':approved.has(origin)?origin:'https://spellquest-staging.onrender.com','Vary':'Origin'};
 if(req.method==='OPTIONS'){if(!approved.has(origin)){send(res,403,{error:'Origin not allowed'});return true;}res.writeHead(204,{...headers,'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Max-Age':'600'});res.end();return true;}
 if(origin&&!approved.has(origin)){send(res,403,{error:'Origin not allowed'});return true;}
 if(!pool){send(res,503,{error:'Secure accounts are not yet activated on this service.'},headers);return true;}
 const ip=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').slice(0,80);
 if(!rate(ip)){send(res,429,{error:'Too many requests. Please try again later.'},headers);return true;}
 try{
  if(path==='/api/account/status'&&req.method==='GET'){const table=await pool.query("SELECT to_regclass('public.accounts') AS accounts,to_regclass('public.learners') AS learners");const ready=Boolean(table.rows[0]?.accounts&&table.rows[0]?.learners&&process.env.ACCOUNT_REGISTRATION_ENABLED==='true');send(res,200,{available:ready,serviceReady:true,pilot:ready?(ADULT_PILOT?'adult':GUARDIAN_PILOT?'guardian':null):null},headers);return true;}
  if(path==='/api/account/register'&&req.method==='POST'){
   if(process.env.ACCOUNT_REGISTRATION_ENABLED!=='true')throw inputError('Registrations are not activated yet.',503);
   const body=await readBody(req),name=username(body.username),pw=password(body.password),kind=body.kind;
   if(!['adult','guardian'].includes(kind)||body.acceptedTerms!==true)throw inputError('Please choose an account type and accept the terms.');
   if(ADULT_PILOT||GUARDIAN_PILOT){
    const code=typeof body.inviteCode==='string'?body.inviteCode.trim():'';
    const allowedHash=GUARDIAN_PILOT?process.env.SPELLMASTER_GUARDIAN_INVITE_SHA256:process.env.SPELLMASTER_PILOT_INVITE_SHA256;
    if(!/^[a-f0-9]{64}$/.test(allowedHash||'')||!code||!SECURITY.safeCompareHex(SECURITY.safeHash(code),allowedHash))throw inputError('A valid invitation code is required.',403);
    if(ADULT_PILOT&&(kind!=='adult'||body.pilotConfirmed!==true||choiceNeverNeeded(body.learner)))throw inputError('Only invited adults may register during this pilot.',403);
    if(GUARDIAN_PILOT){
      if(kind!=='guardian'||body.guardianConfirmed!==true||body.guardianConsent!==true)throw inputError('Only an invited parent or person with parental responsibility can register a child.',403);
      if(!body.learner||choiceNeverNeeded(body.learner)||body.learner.birthMonth)throw inputError('This trial collects only a nickname, age in years and learning progress, not diagnoses or dates of birth.',400);
    }
   }
   const profile=learnerInput(body.learner,kind);
   const client=await pool.connect();try{
    await client.query('BEGIN');
    if(ADULT_PILOT||GUARDIAN_PILOT){const accounts=await client.query('SELECT count(*)::int AS count FROM accounts');if(accounts.rows[0].count>=40)throw inputError('This private testing group is full. Please contact the organiser.',403);}
    const id=uuid();
    await client.query('INSERT INTO accounts(id,username,password_hash,kind) VALUES($1,$2,$3,$4)',[id,name,hashPassword(pw),kind]);
    const learner=await createLearner(client,id,body.learner,kind);
    const recoveryCode=SECURITY.recoveryCode();
    await client.query('INSERT INTO recovery_codes(account_id,code_hash) VALUES($1,$2)',[id,SECURITY.safeHash(recoveryCode)]);
    const token=await session(client,id);await client.query('COMMIT');
    send(res,201,{account:{id,username:name,kind},learner,token,recoveryCode},headers);
   }catch(e){await client.query('ROLLBACK');if(e.code==='23505')throw inputError('That username is already in use.',409);throw e;}finally{client.release();}
   return true;
  }
  if(path==='/api/account/login'&&req.method==='POST'){
   const b=await readBody(req);const name=username(b.username);if(typeof b.password!=='string'||b.password.length>256)throw inputError('Invalid sign-in details.',401);
   if(!SECURITY.allowAttempt('login:'+ip+':'+name,6))throw inputError('Too many sign-in attempts. Try again later.',429);
   const found=await pool.query('SELECT id,username,kind,password_hash FROM accounts WHERE username=$1 AND disabled_at IS NULL',[name]);const valid=found.rowCount&&verifyPassword(b.password,found.rows[0].password_hash);if(!valid)throw inputError('Invalid username or password.',401);
   const token=await session(pool,found.rows[0].id);send(res,200,{account:publicAccount(found.rows[0]),token},headers);return true;
  }
  if(path==='/api/account/recover'&&req.method==='POST'){
   const body=await readBody(req);const name=username(body.username);
   if(!SECURITY.allowAttempt('recover:'+ip+':'+name,4))throw inputError('Too many recovery attempts. Try again later.',429);
   const code=SECURITY.normaliseCode(body.recoveryCode),newPassword=password(body.newPassword);
   if(!code)throw inputError('Invalid recovery code.',400);
   const c=await pool.connect();
   try{
    await c.query('BEGIN');
    const q=await c.query('SELECT a.id,r.code_hash FROM accounts a JOIN recovery_codes r ON r.account_id=a.id WHERE a.username=$1 AND a.disabled_at IS NULL FOR UPDATE OF r',[name]);
    if(!q.rowCount||!SECURITY.safeCompareHex(SECURITY.safeHash(code),q.rows[0].code_hash))throw inputError('Invalid username or recovery code.',401);
    const newCode=SECURITY.recoveryCode();
    await c.query('UPDATE accounts SET password_hash=$2 WHERE id=$1',[q.rows[0].id,hashPassword(newPassword)]);
    await c.query('DELETE FROM sessions WHERE account_id=$1',[q.rows[0].id]);
    await c.query('UPDATE recovery_codes SET code_hash=$2,created_at=now(),redeemed_at=NULL WHERE account_id=$1',[q.rows[0].id,SECURITY.safeHash(newCode)]);
    await c.query('INSERT INTO account_security_audit(id,account_id,action) VALUES($1,$2,$3)',[uuid(),q.rows[0].id,'password_recovered']);
    await c.query('COMMIT');send(res,200,{recovered:true,newRecoveryCode:newCode},headers);
   }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
   return true;
  }
  const a=await identify(req);
  if(path==='/api/account/password'&&req.method==='POST'){
   const body=await readBody(req),newPassword=password(body.newPassword);
   if(!SECURITY.allowAttempt('change:'+a.id,6))throw inputError('Too many attempts. Try again later.',429);
   const found=await pool.query('SELECT password_hash FROM accounts WHERE id=$1',[a.id]);
   if(!found.rowCount||typeof body.currentPassword!=='string'||!verifyPassword(body.currentPassword,found.rows[0].password_hash))throw inputError('Current password is incorrect.',401);
   const c=await pool.connect();try{
    await c.query('BEGIN');
    await c.query('UPDATE accounts SET password_hash=$2 WHERE id=$1',[a.id,hashPassword(newPassword)]);
    await c.query('DELETE FROM sessions WHERE account_id=$1',[a.id]);
    await c.query('INSERT INTO account_security_audit(id,account_id,action) VALUES($1,$2,$3)',[uuid(),a.id,'password_changed']);
    await c.query('COMMIT');send(res,200,{changed:true,signedOut:true},headers);
   }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}return true;
  }
  if(path==='/api/account/export'&&req.method==='GET'){
   const [learners,conditions,preferences,events,states]=await Promise.all([
    pool.query('SELECT id,alias,is_child,birth_month,avatar,theme,created_at FROM learners WHERE account_id=$1',[a.id]),
    pool.query('SELECT c.learner_id,c.condition_code,c.report_status FROM learner_conditions c JOIN learners l ON l.id=c.learner_id WHERE l.account_id=$1',[a.id]),
    pool.query('SELECT p.* FROM learner_preferences p JOIN learners l ON l.id=p.learner_id WHERE l.account_id=$1',[a.id]),
    pool.query('SELECT e.learner_id,e.event_type,e.payload,e.created_at FROM learner_events e JOIN learners l ON l.id=e.learner_id WHERE l.account_id=$1 ORDER BY e.created_at',[a.id]),
    pool.query('SELECT s.learner_id,s.state,s.version,s.updated_at FROM learner_state s JOIN learners l ON l.id=s.learner_id WHERE l.account_id=$1',[a.id])
   ]);
   send(res,200,{exportVersion:1,exportedAt:new Date().toISOString(),account:publicAccount(a),learners:learners.rows,conditions:conditions.rows,preferences:preferences.rows,events:events.rows,states:states.rows},headers);return true;
  }
  if(path==='/api/account/delete'&&req.method==='POST'){
   const body=await readBody(req);
   if(body.confirm!==('DELETE '+a.username))throw inputError('Please enter the exact account deletion confirmation.',400);
   if(!SECURITY.allowAttempt('delete:'+a.id,5))throw inputError('Too many attempts.',429);
   const q=await pool.query('SELECT password_hash FROM accounts WHERE id=$1',[a.id]);
   if(!q.rowCount||typeof body.password!=='string'||!verifyPassword(body.password,q.rows[0].password_hash))throw inputError('Password is incorrect.',401);
   await pool.query('DELETE FROM accounts WHERE id=$1',[a.id]);
   send(res,200,{deleted:true},headers);return true;
  }
  if(path==='/api/account/logout'&&req.method==='POST'){await pool.query('DELETE FROM sessions WHERE token_hash=$1',[tokenHash(a.token)]);send(res,200,{ok:true},headers);return true;}
  if(path==='/api/account/me'&&req.method==='GET'){const q=await pool.query('SELECT id,alias,is_child AS "isChild",birth_month AS "birthMonth",age_years AS "ageYears",avatar,theme FROM learners WHERE account_id=$1 ORDER BY created_at',[a.id]);send(res,200,{account:publicAccount(a),learners:q.rows},headers);return true;}
  if(path==='/api/account/learners'&&req.method==='POST'){
   if(a.kind!=='guardian')throw inputError('Only guardian accounts can create additional child profiles.',403);
   if(GUARDIAN_PILOT)throw inputError('Adding child profiles is disabled during the first supervised pilot. Contact the organiser for an additional invitation.',403);
   const b=await readBody(req);const client=await pool.connect();try{await client.query('BEGIN');const count=await client.query('SELECT count(*)::int AS n FROM learners WHERE account_id=$1',[a.id]);if(count.rows[0].n>=6)throw inputError('Maximum of six learner profiles per guardian account.');const learner=await createLearner(client,a.id,b,'guardian');await client.query('COMMIT');send(res,201,{learner},headers);}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}return true;
  }
  const m=path.match(/^\/api\/account\/learners\/([0-9a-f-]{36})(?:\/(state|events|conditions|research))?$/i);
  if(!m)throw inputError('Endpoint not found.',404);const learner=await owns(a.id,m[1]),section=m[2];
  if(!section&&req.method==='DELETE'){
   if(a.kind!=='guardian')throw inputError('Guardian account required for child profile deletion.',403);
   const b=await readBody(req);if(b.confirm!==learner.alias)throw inputError('Confirm the exact learner nickname.',400);
   const q=await pool.query('SELECT password_hash FROM accounts WHERE id=$1',[a.id]);
   if(!verifyPassword(b.password,q.rows[0].password_hash))throw inputError('Password is incorrect.',401);
   await pool.query('DELETE FROM learners WHERE id=$1 AND account_id=$2',[learner.id,a.id]);
   send(res,200,{deleted:true},headers);return true;
  }
  if(!section&&req.method==='GET'){send(res,200,{learner},headers);return true;}
  if(section==='state'&&req.method==='GET'){const q=await pool.query('SELECT state,version,updated_at FROM learner_state WHERE learner_id=$1',[learner.id]);send(res,200,{state:q.rows[0]?.state||{},version:Number(q.rows[0]?.version||0),updatedAt:q.rows[0]?.updated_at||null},headers);return true;}
  if(section==='state'&&req.method==='PATCH'){
   const b=await readBody(req,1500000);if(!b.state||Array.isArray(b.state)||typeof b.state!=='object')throw inputError('Invalid state.');
   if(!Number.isSafeInteger(b.expectedVersion)||b.expectedVersion<0)throw inputError('Missing state version.');
   const size=Buffer.byteLength(JSON.stringify(b.state));if(size>1400000)throw inputError('Learning state is too large.');
   let q;
   if(b.expectedVersion===0)q=await pool.query('INSERT INTO learner_state(learner_id,state,version) VALUES($1,$2::jsonb,1) ON CONFLICT DO NOTHING RETURNING version,updated_at',[learner.id,JSON.stringify(b.state)]);
   else q=await pool.query('UPDATE learner_state SET state=$2::jsonb,version=version+1,updated_at=now() WHERE learner_id=$1 AND version=$3 RETURNING version,updated_at',[learner.id,JSON.stringify(b.state),b.expectedVersion]);
   if(!q.rowCount)throw inputError('Learning progress was updated on another device. Please reload before continuing.',409);
   send(res,200,{saved:true,version:Number(q.rows[0].version),updatedAt:q.rows[0].updated_at},headers);return true;
  }
  if(section==='events'&&req.method==='GET'){const q=await pool.query('SELECT id,event_type AS type,payload,created_at AS "createdAt" FROM learner_events WHERE learner_id=$1 ORDER BY created_at DESC LIMIT 200',[learner.id]);send(res,200,{events:q.rows},headers);return true;}
  if(section==='events'&&req.method==='POST'){const b=await readBody(req);if(!['assessment','spelling_attempt','review','award','sprint'].includes(b.type)||!b.payload||Array.isArray(b.payload)||typeof b.payload!=='object')throw inputError('Invalid learning event.');const json=JSON.stringify(b.payload);if(json.length>8000)throw inputError('Event is too large.');if(/diagnos|neurodivers|medical|condition/i.test(json))throw inputError('Sensitive information must not be included in learning events.');const id=uuid();await pool.query('INSERT INTO learner_events(id,learner_id,event_type,payload) VALUES($1,$2,$3,$4::jsonb)',[id,learner.id,b.type,json]);send(res,201,{id},headers);return true;}
  if(section==='research'&&req.method==='GET'){
   const q=await pool.query('SELECT grouping_research_consent_at IS NOT NULL AS "consented",grouping_research_consent_version AS version FROM learner_preferences WHERE learner_id=$1',[learner.id]);
   send(res,200,{consented:q.rows[0]?.consented===true,version:q.rows[0]?.version||null},headers);return true;
  }
  if(section==='research'&&req.method==='PATCH'){
   const body=await readBody(req);
   if(typeof body.consent!=='boolean')throw inputError('An explicit yes or no is required.');
   // Child research will need verified guardian permission, appropriate child assent,
   // ethics review and a separately authorised recruitment protocol.
   if(learner.isChild)throw inputError('Child research enrolment is not available.',403);
   await pool.query("UPDATE learner_preferences SET grouping_research_consent_at=CASE WHEN $2 THEN now() ELSE NULL END,grouping_research_consent_version=CASE WHEN $2 THEN 'grouping-study-v1' ELSE NULL END,updated_at=now() WHERE learner_id=$1",[learner.id,body.consent]);
   send(res,200,{consented:body.consent},headers);return true;
  }
  if(section==='conditions'&&req.method==='GET'){const [p,q]=await Promise.all([pool.query('SELECT choice,support_consent_at IS NOT NULL AS "supportConsent",analysis_consent_at IS NOT NULL AS "analysisConsent" FROM learner_preferences WHERE learner_id=$1',[learner.id]),pool.query('SELECT condition_code AS code,report_status AS status FROM learner_conditions WHERE learner_id=$1',[learner.id])]);send(res,200,{choice:p.rows[0]?.choice||'not_supplied',supportConsent:p.rows[0]?.supportConsent||false,analysisConsent:p.rows[0]?.analysisConsent||false,conditions:q.rows},headers);return true;}
  if(section==='conditions'&&req.method==='PATCH'){if(GUARDIAN_PILOT&&learner.isChild)throw inputError('This pilot does not collect child diagnosis information.',403);const b=await readBody(req);const conditions=conditionInput(b.conditions,b.choice);if(b.choice==='selected'&&b.supportConsent!==true)throw inputError('Explicit consent is required for condition information.');if(b.analysisConsent===true&&b.supportConsent!==true)throw inputError('Research consent requires learning-support consent.');const c=await pool.connect();try{await c.query('BEGIN');await c.query("INSERT INTO learner_preferences(learner_id,choice,support_consent_at,analysis_consent_at,consent_text_version) VALUES($1,$2,CASE WHEN $3 THEN now() ELSE NULL END,CASE WHEN $4 THEN now() ELSE NULL END,CASE WHEN $3 THEN 'v1' ELSE NULL END) ON CONFLICT(learner_id) DO UPDATE SET choice=excluded.choice,support_consent_at=CASE WHEN $3 THEN COALESCE(learner_preferences.support_consent_at,now()) ELSE NULL END,analysis_consent_at=CASE WHEN $4 THEN COALESCE(learner_preferences.analysis_consent_at,now()) ELSE NULL END,consent_text_version=CASE WHEN $3 THEN 'v1' ELSE NULL END,updated_at=now()",[learner.id,b.choice,b.supportConsent===true,b.analysisConsent===true]);await c.query('DELETE FROM learner_conditions WHERE learner_id=$1',[learner.id]);for(const x of conditions)await c.query('INSERT INTO learner_conditions(learner_id,condition_code,report_status) VALUES($1,$2,$3)',[learner.id,x.code,x.status]);await c.query('COMMIT');}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}send(res,200,{saved:true},headers);return true;}
  throw inputError('Method not allowed.',405);
 }catch(error){if(error?.status){send(res,error.status,{error:error.message},headers)}else{console.error('Account API error',error.code||error.name||'unknown');send(res,500,{error:'The account service is temporarily unavailable.'},headers)}return true;}
}
const counters=new Map();
function rate(ip){const now=Date.now(),r=counters.get(ip)||{at:now,n:0};if(now-r.at>60000){r.at=now;r.n=0;}r.n++;counters.set(ip,r);if(counters.size>10000)counters.clear();return r.n<=30;}
module.exports={execute,configured:Boolean(pool),__test:{username,password,conditionInput,learnerInput,hashPassword,verifyPassword}};
