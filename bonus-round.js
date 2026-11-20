/* Spellmaster bonus review: short-session recall, not delayed mastery.
 * Browser-compatible, pure planning/scoring with a profile-scoped local reward record.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterBonus=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const KEY='spellmaster-bonus-v1:';
const AVATAR_ITEMS=Object.freeze([
 {id:'star-explorer-hat',name:'Star Explorer Hat',icon:'🎩',price:12,slot:'hat'},
 {id:'comet-trainers',name:'Comet Trainers',icon:'👟',price:8,slot:'shoes'},
 {id:'discovery-glasses',name:'Discovery Glasses',icon:'👓',price:6,slot:'glasses'},
 {id:'adventure-coat',name:'Adventure Coat',icon:'🧥',price:18,slot:'coat'},
 {id:'trail-trousers',name:'Trail Trousers',icon:'👖',price:10,slot:'trousers'},
 {id:'starlight-dress',name:'Starlight Dress',icon:'👗',price:20,slot:'dress'},
 {id:'rainbow-hair',name:'Rainbow Hair',icon:'🌈',price:15,slot:'hair'}
]);
function target(recent=[]){
 const items=recent.slice(-10);
 const struggling=items.filter(x=>x.initial===false||x.attempts>1).length;
 // Three for substantial difficulty; five normally; ten if all first-try correct.
 if(items.length>=3&&struggling>=2)return 3;
 if(items.length>=5&&struggling===0)return 10;
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
  coins:correct===words.length?25:correct*2,bonusPoints:correct===words.length?100:correct*10,avatarItemChoiceEarned:correct===words.length};
}
function key(profile){if(!profile||!/^lp-[a-z0-9]+$/.test(profile.id))throw Error('Local learner profile required');return KEY+profile.id;}
function read(storage,profile){try{const o=JSON.parse(storage.getItem(key(profile))||'{}');return {...(Number.isInteger(o.explorerStyle)&&o.explorerStyle>=0&&o.explorerStyle<6?{explorerStyle:o.explorerStyle}:{}),coins:Number.isSafeInteger(o.coins)&&o.coins>=0?o.coins:0,
  equipped:AVATAR_ITEMS.filter(i=>o.equipped?.includes?.(i.id)&&(o.inventory||o.hats||[]).includes(i.id)).map(i=>i.id),bonusPoints:Number.isSafeInteger(o.bonusPoints)&&o.bonusPoints>=0?o.bonusPoints:0,
  hats:Array.isArray(o.hats)?o.hats:[],inventory:Array.isArray(o.inventory)?o.inventory:Array.isArray(o.hats)?o.hats:[],
  rounds:Array.isArray(o.rounds)?o.rounds:[]}}catch{return {coins:0,bonusPoints:0,hats:[],inventory:[],rounds:[]}}}
function award(storage,profile,roundId,graded){
 if(!graded||!Array.isArray(graded.details)||!Number.isInteger(graded.coins))throw Error('Invalid reward result');
 if(!/^round-[a-z0-9-]+$/.test(roundId))throw Error('Invalid round ID');
 const data=read(storage,profile);
 if(data.rounds.some(x=>x.id===roundId))return {alreadyAwarded:true,...data};
 data.coins+=graded.coins;data.bonusPoints+=graded.bonusPoints;
 data.rounds.push({id:roundId,at:new Date().toISOString(),correct:graded.correct,total:graded.total,
  coins:graded.coins,bonusPoints:graded.bonusPoints,perfect:graded.perfect,
  avatarChoice:graded.perfect?'pending':null,avatarItemId:null,
  category:'immediate_retrieval',notMastery:true});
 data.rounds=data.rounds.slice(-200);
 storage.setItem(key(profile),JSON.stringify(data));return {alreadyAwarded:false,...data};
}
function outfit(equipped,item){
 const conflicts=item.slot==='dress'?['dress','coat','trousers']:['coat','trousers'].includes(item.slot)?[item.slot,'dress']:[item.slot];
 return [...(equipped||[]).filter(id=>!AVATAR_ITEMS.some(i=>i.id===id&&conflicts.includes(i.slot))),item.id];
}
function shopChange(storage,profile,id,action){
 const item=AVATAR_ITEMS.find(i=>i.id===id);
 if(!item)throw Error('Unknown item');
 const state=read(storage,profile);
 if(action==='buy'&&!state.inventory.includes(id)){
  if(state.coins<item.price)throw Error('You need more coins for this item.');
  state.coins-=item.price;state.inventory.push(id);
  if(item.slot==='hat'&&!state.hats.includes(id))state.hats.push(id);
 }
 if(!['buy','wear','remove'].includes(action)||!state.inventory.includes(id))throw Error('Choose an owned item.');
 state.equipped=action==='remove'?(state.equipped||[]).filter(x=>x!==id):outfit(state.equipped,item);
 if(!Number.isInteger(state.explorerStyle))state.explorerStyle=0;
 storage.setItem(key(profile),JSON.stringify(state));return state;
}
function availableChoices(storage,profile){
 const state=read(storage,profile);
 return AVATAR_ITEMS.filter(item=>!state.inventory.includes(item.id));
}
function chooseAvatarReward(storage,profile,roundId,itemId){
 const item=AVATAR_ITEMS.find(x=>x.id===itemId);
 if(!item)throw Error('Unknown avatar reward');
 const state=read(storage,profile);
 const round=state.rounds.find(x=>x.id===roundId);
 if(!round||!round.perfect)throw Error('Bonus choice not earned');
 if(round.avatarChoice!=='pending')return {alreadyClaimed:true,selected:round.avatarItemId||null,...state};
 if(state.inventory.includes(itemId))throw Error('Item already owned: choose another reward');
 round.avatarChoice='claimed';round.avatarItemId=itemId;
 state.inventory.push(itemId);
 state.equipped=outfit(state.equipped,item);
 if(!Number.isInteger(state.explorerStyle))state.explorerStyle=0;
 if(item.slot==='hat'&&!state.hats.includes(itemId))state.hats.push(itemId);
 storage.setItem(key(profile),JSON.stringify(state));
 return {alreadyClaimed:false,selected:itemId,...state};
}
function pendingRewards(storage,profile){
 return read(storage,profile).rounds.filter(x=>x.perfect&&x.avatarChoice==='pending').map(x=>x.id);
}
return {shopChange,outfit,target,chooseRound,grade,read,award,availableChoices,chooseAvatarReward,pendingRewards,AVATAR_ITEMS,key};
});
