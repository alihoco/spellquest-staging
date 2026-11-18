/* Spellmaster bonus review: short-session recall, not delayed mastery.
 * Browser-compatible, pure planning/scoring with a profile-scoped local reward record.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterBonus=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const KEY='spellmaster-bonus-v1:';
function target(recent=[]){
 const items=recent.slice(-10);
 const struggling=items.filter(x=>x.initial===false||x.attempts>1).length;
 // Three for substantial difficulty; five normally; ten if all first-try correct.
 if(items.length>=3&&struggling>=2)return 3;
 if(items.length>=10&&struggling===0)return 10;
 return 5;
}
function chooseRound(results,previousCount=0){
 const eligible=results.slice(previousCount).filter(r=>r&&r.word&&r.learned===true);
 const seen=new Set(),items=eligible.filter(r=>{if(seen.has(r.word))return false;seen.add(r.word);return true;});
 const required=target(items);
 if(items.length<required)return null;
 const chosen=items.slice(-required).map(x=>x.word);
 return {words:chosen,count:chosen.length,fromResultIndex:results.length,stage:'same_session_retrieval',mastery:false};
}
function grade(words,answers){
 if(!Array.isArray(words)||!Array.isArray(answers)||words.length!==answers.length||!words.length)throw Error('Bonus answers missing');
 const details=words.map((w,i)=>({word:w,correct:String(answers[i]||'').trim().toLowerCase().replace(/[^a-z]/g,'')===w}));
 const correct=details.filter(x=>x.correct).length;
 return {correct,total:words.length,perfect:correct===words.length,details,delayedMastery:false,
  coins:correct===words.length?25:correct*2,hatEarned:correct===words.length};
}
function key(profile){if(!profile||!/^lp-[a-z0-9]+$/.test(profile.id))throw Error('Local learner profile required');return KEY+profile.id;}
function read(storage,profile){try{const o=JSON.parse(storage.getItem(key(profile))||'{}');return {coins:Number.isSafeInteger(o.coins)&&o.coins>=0?o.coins:0,
  hats:Array.isArray(o.hats)?o.hats:[],rounds:Array.isArray(o.rounds)?o.rounds:[]}}catch{return {coins:0,hats:[],rounds:[]}}}
function award(storage,profile,roundId,graded){
 if(!graded||!Array.isArray(graded.details)||!Number.isInteger(graded.coins))throw Error('Invalid reward result');
 if(!/^round-[a-z0-9-]+$/.test(roundId))throw Error('Invalid round ID');
 const data=read(storage,profile);
 if(data.rounds.some(x=>x.id===roundId))return {alreadyAwarded:true,...data};
 data.coins+=graded.coins;
 if(graded.hatEarned&&!data.hats.includes('star-explorer-hat'))data.hats.push('star-explorer-hat');
 data.rounds.push({id:roundId,at:new Date().toISOString(),correct:graded.correct,total:graded.total,
  coins:graded.coins,perfect:graded.perfect,category:'immediate_retrieval',notMastery:true});
 data.rounds=data.rounds.slice(-200);
 storage.setItem(key(profile),JSON.stringify(data));return {alreadyAwarded:false,...data};
}
return {target,chooseRound,grade,read,award,key};
});
