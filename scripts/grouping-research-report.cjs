'use strict';
// Internal, manually invoked analysis only. No public endpoint, no row-level exports.
// Query restricted to CURRENTLY consenting adult learners; optional pilot data may
// be analysed only under the published research protocol and governance approval.
const {Pool}=require('pg');
const {summarise}=require('../core/grouping-outcome-analysis.cjs');
async function main(){
 if(process.env.SPELLMASTER_RESEARCH_REPORT_APPROVED!=='true')throw Error('Research reporting requires explicit governance approval.');
 if(!process.env.DATABASE_URL)throw Error('Database unavailable');
 const pool=new Pool({connectionString:process.env.DATABASE_URL,
  ssl:process.env.DATABASE_SSL==='disable'?false:{rejectUnauthorized:true},max:1});
 try{
  const query=`
   SELECT e.learner_id AS learner_id, e.payload, e.created_at,
          l.is_child, p.grouping_research_consent_at
   FROM learner_events e
   JOIN learners l ON l.id=e.learner_id
   JOIN learner_preferences p ON p.learner_id=l.id
   WHERE e.event_type='spelling_attempt'
     AND l.is_child=FALSE
     AND p.grouping_research_consent_at IS NOT NULL
     AND e.created_at >= p.grouping_research_consent_at
   ORDER BY e.created_at ASC
  `;
  const result=await pool.query(query);
  const records=result.rows.map(row=>({
   learnerId:row.learner_id,
   isChild:row.is_child,
   adultResearchConsent:!!row.grouping_research_consent_at,
   adultResearchConsentAt:row.grouping_research_consent_at,
   at:row.created_at,
   payload:row.payload
  }));
  const report=summarise(records,{minimumLearners:10});
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
 }finally{await pool.end()}
}
main().catch(()=>{console.error('Research report blocked or unavailable.');process.exitCode=1});
