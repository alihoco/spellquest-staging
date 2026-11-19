'use strict';
// Ephemeral end-to-end API exercise. Runs BEFORE opening the HTTP listener.
// Synthetic accounts are removed even if the assertions fail.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {Readable}=require('node:stream');
const {Pool}=require('pg');
async function main(){
  if(!process.env.DATABASE_URL)throw Error('No private database configured');
  if(process.env.ACCOUNT_REGISTRATION_ENABLED==='true')throw Error('Synthetic smoke test cannot run with public registration open');
  const prev=process.env.ACCOUNT_REGISTRATION_ENABLED;
  process.env.ACCOUNT_REGISTRATION_ENABLED='true';
  const {execute}=require('../account-api.js');
  const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==='disable'?false:{rejectUnauthorized:true},max:1});
  const accountIds=[];
  async function call(path,{method='GET',body,token}={}){
    const req=Readable.from(body===undefined?[]:[Buffer.from(JSON.stringify(body))]);
    req.url=path;req.method=method;req.headers={origin:'https://spellquest-staging.onrender.com'};
    if(token)req.headers.authorization='Bearer '+token;
    req.socket={remoteAddress:'127.0.0.1'};
    const res={status:0,body:'',writeHead(code){this.status=code;},end(chunk){this.body=chunk||'';}};
    await execute(req,res,path);
    let data={};try{data=JSON.parse(res.body||'{}')}catch{}
    return {status:res.status,data};
  }
  try{
    const password='PilotSmoke'+crypto.randomBytes(16).toString('hex')+'!';
    const username='smoke_'+crypto.randomBytes(7).toString('hex');
    const r=await call('/api/account/register',{method:'POST',body:{username,password,kind:'guardian',acceptedTerms:true,learner:{alias:'Synthetic Learner',avatar:'fox'}}});
    assert.equal(r.status,201,'Guardian registration');
    accountIds.push(r.data.account.id);
    assert.ok(r.data.recoveryCode,'Recovery code generated');
    const {token,learner}=r.data;
    const other=await call('/api/account/register',{method:'POST',body:{username:'smoke_'+crypto.randomBytes(7).toString('hex'),password,kind:'adult',acceptedTerms:true,learner:{alias:'Synthetic Adult'}}});
    assert.equal(other.status,201,'Second account registration');
    accountIds.push(other.data.account.id);
    const login=await call('/api/account/login',{method:'POST',body:{username,password}});
    assert.equal(login.status,200,'Password sign-in');
    const me=await call('/api/account/me',{token});
    assert.equal(me.status,200,'Account identity');
    assert.equal(me.data.learners.length,1);
    const restricted=await call('/api/account/learners/'+learner.id+'/state',{token:other.data.token});
    assert.equal(restricted.status,404,'Cross-account access denied');
    const state=await call('/api/account/learners/'+learner.id+'/state',{token});
    assert.equal(state.status,200);
    assert.equal(state.data.version,0);
    const changed=await call('/api/account/learners/'+learner.id+'/state',{token,method:'PATCH',body:{state:{history:{because:{events:[{correct:true}]}}},expectedVersion:0}});
    assert.equal(changed.status,200,'Save learner state');
    const stale=await call('/api/account/learners/'+learner.id+'/state',{token,method:'PATCH',body:{state:{history:{}},expectedVersion:0}});
    assert.equal(stale.status,409,'Old device rejected');
    const remembered=await call('/api/account/learners/'+learner.id+'/state',{token});
    assert.equal(remembered.data.version,1);
    assert.ok(remembered.data.state.history.because);
    const sensitive=await call('/api/account/learners/'+learner.id+'/conditions',{token,method:'PATCH',body:{choice:'selected',conditions:[{code:'dyslexia',status:'suspected'}],supportConsent:true,analysisConsent:false}});
    assert.equal(sensitive.status,200,'Private consent choice saved');
    const denied=await call('/api/account/learners/'+learner.id+'/conditions',{token:other.data.token});
    assert.equal(denied.status,404,'Sensitive details restricted');
    const cleared=await call('/api/account/learners/'+learner.id+'/conditions',{token,method:'PATCH',body:{choice:'prefer_not_to_say',conditions:[],supportConsent:false,analysisConsent:false}});
    assert.equal(cleared.status,200,'Consent withdrawn and details removed');
    const exportData=await call('/api/account/export',{token});
    assert.equal(exportData.status,200,'Personal export');
    assert.equal(exportData.data.learners.length,1);
    const reset=await call('/api/account/recover',{method:'POST',body:{username,recoveryCode:r.data.recoveryCode,newPassword:password+'new'}});
    assert.equal(reset.status,200,'One-time password recovery');
    const old=await call('/api/account/me',{token});
    assert.equal(old.status,401,'Recovery revokes old sessions');
    const newlyLogged=await call('/api/account/login',{method:'POST',body:{username,password:password+'new'}});
    assert.equal(newlyLogged.status,200,'Recovered login');
    const deleted=await call('/api/account/delete',{token:newlyLogged.data.token,method:'POST',body:{confirm:'DELETE '+username,password:password+'new'}});
    assert.equal(deleted.status,200,'Account deletion');
    const remaining=await pool.query('SELECT count(*)::int AS n FROM accounts WHERE id=$1',[r.data.account.id]);
    assert.equal(remaining.rows[0].n,0);
    process.stdout.write('Synthetic full account journey passed: registration, auth, guardian, isolation, learning sync, consent, export, recovery, deletion.\\n');
  }finally{
    for(const id of accountIds)await pool.query('DELETE FROM accounts WHERE id=$1',[id]).catch(()=>{});
    await pool.end();
    process.env.ACCOUNT_REGISTRATION_ENABLED=prev||'false';
  }
}
main().catch(e=>{console.error('Synthetic account journey failed:',e.message);process.exitCode=1;});
