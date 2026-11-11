'use strict';
// Provisional scheduling: intervals are hypotheses to validate, not proven optimal for dyslexic learners.
const DAY=86400000;
function addDays(iso,days){const d=new Date(iso+'T12:00:00Z');if(Number.isNaN(d.getTime()))throw Error('Invalid date');return new Date(d.getTime()+days*DAY).toISOString().slice(0,10)}
function schedule({word_id,teaching_date,history=[],review_intervals=[1,3,7,14,28]}){
 if(!word_id||!teaching_date)throw Error('Missing word/date');
 const observations=history.filter(x=>x.word_id===word_id && x.independent && !x.shown_target_letters).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
 const last=observations.at(-1);
 if(last&&last.correct===false)return {word_id,due:addDays(last.date,1),phase:'targeted_reteach',mastered:false,reason:'independent_error'};
 const retained=observations.filter(x=>x.correct && x.delayed).length;
 const base=last?.date||teaching_date;
 const interval=review_intervals[Math.min(retained,review_intervals.length-1)];
 return {word_id,due:addDays(base,interval),phase:'independent_delayed_retrieval',mastered:retained>=2,reason:'provisional_spacing'};
}
function dailyQueue({today,word_records,history=[],new_words=[],max_new=3,max_due=8}){
 const due=word_records.map(w=>schedule({word_id:w.id,teaching_date:w.teaching_date,history})).filter(x=>x.due<=today);
 due.sort((a,b)=>a.due.localeCompare(b.due));
 return {review:due.slice(0,max_due),new:new_words.slice(0,max_new),remaining_review:Math.max(0,due.length-max_due)};
}
function mixedReview({word_ids,items,previous_cluster_ids=[]}){
 // Deterministic interleaving: rotate clusters to avoid adjacent same-family words where feasible.
 const selected=items.filter(x=>word_ids.includes(x.id));
 const groups=new Map();for(const x of selected){const key=x.cluster||'other';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(x)}
 const result=[];let last=null;
 while([...groups.values()].some(x=>x.length)){
  const options=[...groups.entries()].filter(([k,v])=>v.length&&k!==last);
  const pool=options.length?options:[...groups.entries()].filter(([,v])=>v.length);
  pool.sort((a,b)=>b[1].length-a[1].length || a[0].localeCompare(b[0]));
  const [key,items]=pool[0];result.push(items.shift().id);last=key;
 }
 return result;
}
module.exports={addDays,schedule,dailyQueue,mixedReview};
