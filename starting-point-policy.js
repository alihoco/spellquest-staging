/* Adaptive, ten-turn starting-point sample. Age is never used for ability.
 * Short, mixed initial probes adapt to actual independent accuracy.
 * Not a standardised diagnostic test or age norm.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterStartingPoint=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const BANK={
  year1:['said','come','after','where','love','today'],
  year2:['night','people','water','beautiful','could','again'],
  year3_4:['because','answer','different','important','remember','occasion'],
  year5_6:['necessary','environment','familiar','accommodate','government','rhythm']
 };
 const BANDS=Object.keys(BANK);
 const ORDER=[{word:'said',band:'year1'},{word:'night',band:'year2'},{word:'because',band:'year3_4'}];
 function planned(results=[],count=10){
  if(results.length>=count)return null;
  if(results.length<ORDER.length)return ORDER[results.length];
  const recent=results.slice(-3);
  const score=recent.filter(r=>r.independent===true).length;
  const lastBand=BANDS.indexOf(results.at(-1).band||'year2');
  const index=Math.max(0,Math.min(3,lastBand+(score>=2?1:score===0?-1:0)));
  const pool=BANK[BANDS[index]];
  const used=new Set(results.map(r=>r.word));
  const free=pool.find(w=>!used.has(w));
  if(free)return {word:free,band:BANDS[index]};
  for(let offset=1;offset<=3;offset++)for(const candidate of [index-offset,index+offset]){
   if(candidate<0||candidate>3)continue;
   const available=BANK[BANDS[candidate]].find(x=>!used.has(x));
   if(available)return {word:available,band:BANDS[candidate]};
  }
  return null;
 }
 function placement(results=[]){
  const map=new Map(BANDS.map(b=>[b,results.filter(r=>r.band===b)]));
  // Never claim ability from age or a single response. Choose a provisional
  // support-friendly starting band, then update from the child's later work.
  let answer='year1';
  for(const band of BANDS){
   const probes=map.get(band);
   if(probes.length>=2&&probes.filter(x=>x.independent).length>=Math.ceil(probes.length*.6))answer=band;
  }
  if(results.filter(x=>x.independent).length>=7&&answer==='year1')answer='year2';
  return {version:2,baselineBand:answer,currentBand:answer,source:'adaptive_10_word_assessment_provisional',
    observations:[],moves:[],updatedAt:new Date().toISOString()};
 }
 return {BANK,BANDS,planned,placement};
});
