/* Adaptive, ten-turn starting-point sample. Age is never used for ability.
 * Short, mixed initial probes adapt to actual independent accuracy.
 * Not a standardised diagnostic test or age norm.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterStartingPoint=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const BANK={
  year1:['said','come','go','my','the','we','be','ask','after','where','love','today'],
  year2:['night','people','water','beautiful','could','again'],
  year3_4:['because','answer','different','important','remember','occasion'],
  year5_6:['necessary','environment','familiar','accommodate','government','rhythm']
 };
 const BANDS=Object.keys(BANK);
 function planned(results=[],count=10,age=null){
  if(results.length>=count)return null;
  const ceiling=!Number.isFinite(age)?1:age<=6?0:age<=7?1:age<=9?2:3;
  const recent=results.slice(-3);
  const lastBand=Math.max(0,BANDS.indexOf(results.at(-1)?.band));
  const ready=recent.length===3&&recent.every(r=>r.independent&&r.band===BANDS[lastBand]);
  const index=Math.min(ceiling,Math.max(0,lastBand+(ready?1:recent.at(-1)?.independent===false?-1:0)));
  const pool=BANK[BANDS[index]];
  const used=new Set(results.map(r=>r.word));
  const free=pool.find(w=>!used.has(w));
  if(free)return {word:free,band:BANDS[index]};
  for(let offset=1;offset<=3;offset++)for(const candidate of [index-offset,index+offset]){
   if(candidate<0||candidate>ceiling)continue;
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
  return {version:2,baselineBand:answer,currentBand:answer,source:'adaptive_10_word_assessment_provisional',
    observations:[],moves:[],updatedAt:new Date().toISOString()};
 }
 return {BANK,BANDS,planned,placement};
});
