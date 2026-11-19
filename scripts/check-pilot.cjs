'use strict';
const assert=require('node:assert/strict');
async function main(){
 const base='https://spellquest-voice-staging.onrender.com';
 async function request(path,options={}) {
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch(base+path,{...options,signal:controller.signal});
   const body=await response.json();
   return {status:response.status,body};
  }finally{clearTimeout(timeout);}
 }
 let status;
 for(let i=0;i<12;i++){
  try{
   status=await request('/api/account/status');
   if(status.status===200&&status.body.available&&status.body.pilot==='adult')break;
  }catch{}
  await new Promise(resolve=>setTimeout(resolve,5000));
 }
 assert.equal(status?.status,200,'Account status endpoint must respond');
 assert.equal(status.body.available,true,'Adult pilot registration should be enabled');
 assert.equal(status.body.pilot,'adult','Child signups must remain disabled');
 const invalid=await request('/api/account/register',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://spellquest-staging.onrender.com'},body:JSON.stringify({username:'invalidinvitetest',password:'NotTheActualPilotPassword123!',kind:'adult',acceptedTerms:true,pilotConfirmed:true,inviteCode:'invalid-invite',learner:{alias:'Synthetic Guest'}})});
 assert.equal(invalid.status,403,'Unknown invite must be rejected');
 const child=await request('/api/account/register',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://spellquest-staging.onrender.com'},body:JSON.stringify({username:'invalidchildtest',password:'NotTheActualPilotPassword123!',kind:'guardian',acceptedTerms:true,pilotConfirmed:true,inviteCode:'invalid-invite',learner:{alias:'Synthetic Child'}})});
 assert.equal(child.status,403,'Guardian/child registration must be blocked');
 const health=await request('/health');
 assert.equal(health.status,200,'Voice service health endpoint must respond');
 assert.equal(health.body.ok,true,'Voice service must be healthy');
 process.stdout.write('External adult-only pilot checks passed. Invitations enforced, guardian registrations blocked, voice service healthy.\n');
}
main().catch(e=>{console.error('External pilot check failed:',e.message);process.exitCode=1;});
