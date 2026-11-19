'use strict';
// Safe, idempotent schema bootstrap for the dedicated Spellmaster Postgres instance.
// Runs only in Render with DATABASE_URL set; stops deployment on a failed migration.
const fs=require('node:fs');
const path=require('node:path');
const {Pool}=require('pg');
async function main(){
  if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required for schema migration');
  const registrationOpen=process.env.ACCOUNT_REGISTRATION_ENABLED==='true';
  const pool=new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:process.env.DATABASE_SSL==='disable'?false:{rejectUnauthorized:true},
    max:1,
    connectionTimeoutMillis:15000
  });
  const client=await pool.connect();
  try{
    const database=await client.query('SELECT current_database() AS db');
    if(database.rows[0]?.db!=='spellmaster_accounts')throw Error('Migration refused: expected dedicated spellmaster_accounts database');
    if(!registrationOpen){
      await client.query('BEGIN');
      await client.query(fs.readFileSync(path.join(__dirname,'../database/001_accounts.sql'),'utf8'));
      await client.query(fs.readFileSync(path.join(__dirname,'../database/002_security.sql'),'utf8'));
      await client.query('COMMIT');
    }
    const tables=await client.query("SELECT to_regclass('public.accounts') AS accounts,to_regclass('public.learners') AS learners,to_regclass('public.learner_events') AS events,to_regclass('public.recovery_codes') AS recovery");
    if(!tables.rows[0]?.accounts||!tables.rows[0]?.learners||!tables.rows[0]?.events||!tables.rows[0]?.recovery)throw Error('Schema bootstrap verification failed');
    if(!registrationOpen){await require('./smoke-db.js')(client);process.stdout.write('Spellmaster learner ownership and rollback smoke test passed.\n');}
    process.stdout.write('Spellmaster account schema verified.\n');
  }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error}
  finally{client.release();await pool.end();}
}
main().catch(e=>{console.error('Schema bootstrap failed:',e.message);process.exitCode=1});
