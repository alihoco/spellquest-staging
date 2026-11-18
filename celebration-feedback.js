/* Short, grounded praise with no immediate repetition.
   Two calibrated pools: first-try accurate spelling and independently corrected
   spelling after instruction. Neither is evidence of durable mastery.
*/
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterPraise=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const POOLS=Object.freeze({
  first:[
   'Nice work. That spelling was right.',
   'Great job. You remembered it.',
   'Well done. You knew that one.',
   'Good remembering. That was correct.',
   'You got it. Nice spelling.',
   'That came straight from memory. Well done.',
   'Good work. You spelled it independently.',
   'Yes, that is the right spelling.',
   'You remembered that one. Great.',
   'Nicely done. Let us keep going.'
  ],
  after_help:[
   'You worked it out. Nice job.',
   'Great work. That practice helped.',
   'You got it this time. Well done.',
   'Nice persistence. You spelled it correctly.',
   'That is the spelling. Good work.',
   'You remembered the tricky part. Great.',
   'Well done. Your new attempt is correct.',
   'Awesome work. You figured that one out.',
   'Good thinking. You got the spelling right.',
   'Look at that. You worked it out.'
  ]
 });
 function makeState(start=0){return {firstIndex:start%POOLS.first.length,afterHelpIndex:start%POOLS.after_help.length,
  lastId:null,lastText:null};}
 function next(state,category){
  if(!['first','after_help'].includes(category))throw Error('Unknown praise category');
  const key=category==='first'?'firstIndex':'afterHelpIndex',items=POOLS[category];
  let index=state[key]%items.length;
  if(category+'-'+index===state.lastId)index=(index+1)%items.length;
  const id=category+'-'+index;
  state[key]=(index+1)%items.length;state.lastId=id;state.lastText=items[index];
  return {id,clip:'spellmaster-praise-'+id+'-v1',text:items[index],category,indicatesMastery:false};
 }
 function audioClips(){const out={};for(const [category,items] of Object.entries(POOLS))
  items.forEach((line,i)=>out['spellmaster-praise-'+category+'-'+i+'-v1']=line);
  return out;
 }
 return {POOLS,makeState,next,audioClips};
});
