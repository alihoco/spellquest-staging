'use strict';
const crypto=require('node:crypto');
// Transactional database smoke test. All test records are rolled back.
module.exports=async function smoke(client){
 const first=crypto.randomUUID(),other=crypto.randomUUID(),learner=crypto.randomUUID();
 await client.query('BEGIN');
 try{
  await client.query("INSERT INTO accounts(id,username,password_hash,kind) VALUES($1,$2,$3,'guardian'),($4,$5,$6,'guardian')",
   [first,'smoketest_'+crypto.randomBytes(6).toString('hex'),'test-hash-do-not-login',other,'smoketest_'+crypto.randomBytes(6).toString('hex'),'test-hash-do-not-login']);
  await client.query("INSERT INTO learners(id,account_id,alias,is_child) VALUES($1,$2,'Temporary database test',true)",[learner,first]);
  const owner=await client.query('SELECT id FROM learners WHERE id=$1 AND account_id=$2',[learner,first]);
  const stranger=await client.query('SELECT id FROM learners WHERE id=$1 AND account_id=$2',[learner,other]);
  if(owner.rowCount!==1||stranger.rowCount!==0)throw Error('Learner account ownership isolation failed');
  await client.query("INSERT INTO learner_conditions(learner_id,condition_code,report_status) VALUES($1,'dyslexia','suspected')",[learner]);
  await client.query("INSERT INTO learner_events(id,learner_id,event_type,payload) VALUES($1,$2,'assessment',$3::jsonb)",[crypto.randomUUID(),learner,JSON.stringify({words:10})]);
  const selected=await client.query('SELECT count(*)::int AS n FROM learner_events WHERE learner_id=$1',[learner]);
  if(selected.rows[0].n!==1)throw Error('Learning event persistence failed');
 }finally{
  await client.query('ROLLBACK');
 }
 const leak=await client.query('SELECT count(*)::int AS n FROM accounts WHERE id=$1 OR id=$2',[first,other]);
 if(leak.rows[0].n!==0)throw Error('Smoke test rollback failed');
};
