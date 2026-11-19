'use strict';
const assert=require('node:assert/strict');
const base='https://spellquest-voice-staging.onrender.com';
async function get(path,options={}){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),16000);
 try{const r=await fetch(base+path,{...options,signal:controller.signal});return {status:r.status,data:await r.json()};}
 finally{clearTimeout(timeout);}
}
async function run(){
 let status;
 for(let i=0;i<10;i++){
  try{status=await get('/api/account/status');if(status.status===200&&status.data?.pilot==='guardian'&&status.data.available)break;}catch{}
  await new Promise(r=>setTimeout(r,3000));
 }
 assert.equal(status?.status,200);
 assert.equal(status.data.available,true);
 assert.equal(status.data.pilot,'guardian');
 const invalid=await get('/api/account/register',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://spellquest-staging.onrender.com'},body:JSON.stringify({
  username:'guardiancheck'+Math.random().toString(36).slice(2,7),password:'SyntheticNoRealPassword!1234',
  kind:'guardian',acceptedTerms:true,guardianConfirmed:true,guardianConsent:true,inviteCode:'invalid',learner:{alias:'Synthetic Explorer',ageYears:9,avatar:'owl'}})});
 assert.equal(invalid.status,403,'Invalid invitations must be rejected');
 const health=await get('/health');
 assert.equal(health.status,200);
 assert.equal(health.data.ok,true);
 assert.equal(health.data.configured,true,'AI narration must be configured');
 const website=await fetch('https://spellquest-staging.onrender.com/family-signup.html');
 assert.equal(website.status,200);
 assert.match(await website.text(),/age in whole years|How old is the learner today\?/i);
 console.log('LIVE GUARDIAN MODE VERIFIED: '+JSON.stringify({registration:status.data.pilot,invitationRejected:invalid.status,voiceHealth:health.status,voiceConfigured:health.data.configured,familySignupPage:website.status}));
}
run().catch(error=>{console.error('Guardian live readiness failed:',error.message);process.exitCode=1;});
