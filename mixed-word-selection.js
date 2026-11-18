/* Spellmaster mixed word selection for the ten-word staging pilot.
 * Research-informed heuristic; NOT a validated scientific dosage.
 * Never claims same-session restudy is delayed mastery.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterMixedWords=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
function select({words=[],history={},session=[],today,runCount=0,runNew=0,seen=[]}={}){
 if(!Array.isArray(words)||!words.length)return null;
 const id=w=>typeof w==='string'?w:w.word;
 const indexBy=new Map(words.map((w,i)=>[id(w),i]));
 const recent=session.slice(-2).map(x=>x.word);
 const used=new Set(session.map(x=>x.word));
 const historyEntries=Object.entries(history||{});
 const hasRecord=word=>Boolean(history[word]?.events?.length);
 const due=words.map((w,i)=>({i,word:id(w),record:history[id(w)]}))
   .filter(x=>x.record&&typeof x.record.next==='string'&&x.record.next<=today&&!used.has(x.word))
   .sort((a,b)=>a.record.next.localeCompare(b.record.next));
 const fresh=words.map((w,i)=>({i,word:id(w)})).filter(x=>!hasRecord(x.word)&&!used.has(x.word));
 // Due later-day independent retrieval has priority, especially early in the adventure.
 if(due.length&&(runCount%3!==2||!fresh.length))return {i:due[0].i,review:true,kind:'due'};
 // Mix a familiar word after at least two other turns, while newer material remains.
 if(runCount>=2&&runCount%3===2&&used.size>=2){
  const mixed=pickPractice(words,history,session,{excludeRecent:recent,excludeNeverTaught:true});
  if(mixed)return {i:mixed.i,review:false,kind:'practice'};
 }
 if(fresh.length)return {i:fresh[0].i,review:false,kind:'new'};
 if(due.length)return {i:due[0].i,review:true,kind:'due'};
 // Everything has already been encountered. Allow indefinite *optional* practice
 // of the finite reviewed pilot pool; do not label it "new" or "due".
 const selected=pickPractice(words,history,session,{excludeRecent:recent,excludeNeverTaught:false});
 return selected?{i:selected.i,review:false,kind:'practice'}:null;
}
function pickPractice(words,history,session,{excludeRecent=[],excludeNeverTaught=true}={}){
 const id=w=>typeof w==='string'?w:w.word;
 const recent=new Set(excludeRecent);
 const known=words.map((w,i)=>({i,word:id(w),record:history[id(w)]||{}}))
  .filter(x=>!excludeNeverTaught||Array.isArray(x.record.events)&&x.record.events.length);
 if(!known.length)return null;
 const eligible=known.filter(x=>!recent.has(x.word));
 // With just one/two words in a pool, permit a replay rather than a false lock-out.
 const pool=eligible.length?eligible:known;
 const times=new Map();for(const entry of session)times.set(entry.word,(times.get(entry.word)||0)+1);
 const last=new Map();session.forEach((entry,i)=>last.set(entry.word,i));
 const missed=word=>Array.isArray(history[word]?.events)?
  history[word].events.slice(-4).filter(e=>e.correct===false).length:0;
 pool.sort((a,b)=>{
  const aCount=times.get(a.word)||0,bCount=times.get(b.word)||0;
  // First favour unused previously taught words, then error-informed revision.
  if(aCount!==bCount)return aCount-bCount;
  const aMiss=missed(a.word),bMiss=missed(b.word);
  if(aMiss!==bMiss)return bMiss-aMiss;
  return (last.get(a.word)??-1)-(last.get(b.word)??-1)||a.i-b.i;
 });
 return pool[0];
}
return {select,pickPractice};
});
