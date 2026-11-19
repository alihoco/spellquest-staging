'use strict';
// Temporary synthetic private DB journey for the invitation-only guardian mode.
// The HTTP listener is not started until this completes; synthetic rows are deleted.
// No real invitation code, child identity or diagnosis is used.
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {Readable}=require('node:stream');
const {Pool}=require('pg');
async function main(){
 if(process.env.SPELLMASTER_PILOT_MODE!=='guardian'||process.env.ACCOUNT_REGISTRATION_ENABLED!=='true'){
  process.stdout.write('Guardian smoke test not required in this mode.\n');return;
 }
 const syntheticCode=crypto.randomBytes(24).toString('base64url');
 const storedHash=process.env.SPELLMASTER_GUARDIAN_INVITE_SHA256;
 process.env.SPELLMASTER_GUARDIAN_INVITE_SHA256=crypto.createHash('sha256').update(syntheticCode).digest('hex');
 const {execute}=require('../account-api.js');
 const pool=new Pool({connectionString:process.env.DATABASE_URL,
  ssl:process.env.DATABASE_SSL==='disable'?false:{rejectUnauthorized:true},max:1});
 const ids=[];
 const origin='https://spellquest-staging.onrender.com';
 async function run(path,{method='GET',body,token}={}){
  const req=Readable.from(body===undefined?[]:[Buffer.from(JSON.stringify(body))]);
  req.url=path;req.method=method;req.headers={origin};if(token)req.headers.authorization='Bearer '+token;
  req.socket={remoteAddress:'synthetic-guardian-test'};
  const res={status:0,body:'',writeHead(n){this.status=n},end(x){this.body=x||''}};
  await execute(req,res,path);
  let data={};try{data=JSON.parse(res.body)}catch{}
  return {status:res.status,data};
 }
 try{
  const name='gtrial_'+crypto.randomBytes(7).toString('hex'),pw='SmokeTestOnly-'+crypto.randomBytes(14).toString('hex');
  const learner={alias:'Temporary Explorer',ageYears:9,avatar:'owl',conditionChoice:'not_supplied',conditions:[]};
  const request={username:name,password:pw,kind:'guardian',acceptedTerms:true,guardianConfirmed:true,guardianConsent:true,inviteCode:syntheticCode,learner};
  const bad=await run('/api/account/register',{method:'POST',body:{...request,inviteCode:'bad-code'}});
  assert.equal(bad.status,403,'Bad private invite denied');
  const unconfirmed=await run('/api/account/register',{method:'POST',body:{...request,guardianConsent:false}});
  assert.equal(unconfirmed.status,403,'Parent consent required');
  const diagnosis=await run('/api/account/register',{method:'POST',body:{...request,learner:{...learner,conditions:[{code:'dyslexia',status:'suspected'}],conditionChoice:'selected',supportConsent:true}}});
  assert.equal(diagnosis.status,400,'No diagnosis collection');
  const dob=await run('/api/account/register',{method:'POST',body:{...request,learner:{...learner,birthMonth:'2017-05'}}});
  assert.equal(dob.status,400,'No birth month');
  const created=await run('/api/account/register',{method:'POST',body:request});
  assert.equal(created.status,201,'Parent signup');
  ids.push(created.data.account.id);
  assert.equal(created.data.learner.ageYears,9);
  assert.equal(created.data.learner.isChild,true);
  assert.ok(created.data.recoveryCode);
  const token=created.data.token,learnerId=created.data.learner.id;
  const me=await run('/api/account/me',{token});
  assert.equal(me.status,200);
  assert.equal(me.data.learners[0].ageYears,9);
  assert.equal(me.data.learners[0].birthMonth,null);
  const state=await run('/api/account/learners/'+learnerId+'/state',{token});
  assert.equal(state.status,200);
  const save=await run('/api/account/learners/'+learnerId+'/state',{token,method:'PATCH',body:{
   expectedVersion:state.data.version,state:{history:{because:{events:[{correct:false,phase:'new_word'}]}}}}});
  assert.equal(save.status,200,'Save spelling');
  const reload=await run('/api/account/learners/'+learnerId+'/state',{token});
  assert.equal(reload.data.state.history.because.events[0].correct,false);
  const childStudy=await run('/api/account/learners/'+learnerId+'/research',{token,method:'PATCH',body:{consent:true}});
  assert.equal(childStudy.status,403,'Child research denied');
  const childDiagnosis=await run('/api/account/learners/'+learnerId+'/conditions',{token,method:'PATCH',body:{choice:'selected',supportConsent:true,conditions:[{code:'dyslexia',status:'suspected'}]}});
  assert.equal(childDiagnosis.status,403,'Child diagnoses denied');
  const noOther=await run('/api/account/learners',{token,method:'POST',body:{alias:'Another Kid',ageYears:8}});
  assert.equal(noOther.status,403,'No extra child profiles');
  const deleteResult=await run('/api/account/delete',{token,method:'POST',body:{confirm:'DELETE '+name,password:pw}});
  assert.equal(deleteResult.status,200,'Parent can delete account');
  const left=await pool.query('SELECT count(*)::int AS n FROM accounts WHERE id=$1',[created.data.account.id]);
  assert.equal(left.rows[0].n,0,'All synthetic account data purged');
  process.stdout.write('Guardian synthetic DB test passed: invitation, consent, age-only, no diagnoses/research, progress save and deletion.\n');
 }finally{
  for(const id of ids)await pool.query('DELETE FROM accounts WHERE id=$1',[id]).catch(()=>{});
  await pool.end();
  process.env.SPELLMASTER_GUARDIAN_INVITE_SHA256=storedHash;
 }
}
main().catch(e=>{console.error('Guardian DB smoke check failed:',e.message);process.exitCode=1;});
