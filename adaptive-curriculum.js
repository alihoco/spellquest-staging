/* Source-grounded England curriculum intake and provisional placement.
 * Browser / Node UMD: no phoneme or morphology invented from unreviewed records.
 * Learning-band movement uses independent first attempts, never age as a cap.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterCurriculum=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const BANDS=['year1','year2','year3_4','year5_6'];
const PILOT=['necessary','embarrass','accommodate','government','foreign','familiar','environment','privilege','rhythm','temperature'];
function validBand(v){return BANDS.includes(v)}
function ageStartingBand(age){
 if(!Number.isFinite(age))return 'year3_4';
 if(age<=6)return 'year1';if(age===7)return 'year2';if(age<=9)return 'year3_4';return 'year5_6';
}
function yearStartingBand(year){
 if(!Number.isInteger(year)||year<1||year>6)return null;
 return year===1?'year1':year===2?'year2':year<=4?'year3_4':'year5_6';
}
function starter(profile,ageYears){
 return yearStartingBand(profile?.schoolYear)||ageStartingBand(ageYears);
}
function prepare(catalogue,approvedPilot={}){
 if(!catalogue||!Array.isArray(catalogue.words))throw Error('Curriculum word bank missing');
 const seen=new Set();
 const words=catalogue.words.map(w=>{
  if(!w||!/^en-[a-z]+(?:-[a-z]+)*$/.test(w.id)||!(/^[a-z]+$/.test(w.word))||
    !validBand(w.curriculum_band)||seen.has(w.word))throw Error('Invalid/duplicate curriculum spelling');
  seen.add(w.word);
  const pilot=approvedPilot[w.word];
  // Default to whole correct orthography only. Draft segmentation is not linguistic truth.
  return {id:w.id,word:w.word,band:w.curriculum_band,
   curriculumRole:w.curriculum_role,teachingStatus:w.teaching_approval,
   teachingGroups:(w.teaching_groups||[]).map(g=>g.id),
   spelling:pilot?.spelling?.join('')===w.word?pilot.spelling.slice():[w.word],
   audioApproved:false,wholeWordDraft:true};
 });
 if(words.length!==615)throw Error('Unexpected curriculum word-count; review updated source before using');
 return words;
}
function seedPreference(profile,ageYears){
 const band=starter(profile,ageYears);
 return {baselineBand:band,currentBand:band,source:yearStartingBand(profile?.schoolYear)?'school_year':'age_month',
  observations:[],moves:[],updatedAt:new Date().toISOString(),version:1};
}
function placementKey(profile){
 if(!profile||!/^lp-[a-z0-9]+$/.test(profile.id))throw Error('Learner profile required');
 return 'spellmaster-placement-v1:'+profile.id;
}
function readPlacement(storage,profile,ageYears){
 const seed=seedPreference(profile,ageYears);
 try{
  const o=JSON.parse(storage.getItem(placementKey(profile))||'null');
  if(!o||!validBand(o.currentBand))return seed;
  return {...seed,...o,observations:Array.isArray(o.observations)?o.observations:[],
   moves:Array.isArray(o.moves)?o.moves:[]};
 }catch{return seed}
}
function savePlacement(storage,profile,state){
 storage.setItem(placementKey(profile),JSON.stringify(state));return state;
}
function resetStartingPoint(storage,profile,ageYears){
 const state=seedPreference(profile,ageYears);return savePlacement(storage,profile,state);
}
function recordIndependent(storage,profile,ageYears,word,correct){
 const state=readPlacement(storage,profile,ageYears);
 if(!word||!validBand(word.band)||typeof correct!=='boolean')return state;
 // An old word due for review can be practised across bands, but does not alone
 // shift the learner's current starting level.
 const entry={word:word.word,band:word.band,correct,at:new Date().toISOString()};
 state.observations.push(entry);
 state.observations=state.observations.slice(-500);
 const current=state.currentBand;
 if(word.band===current){
  const since=state.moves.length?state.moves[state.moves.length-1].at:'';
  const bandAttempts=state.observations.filter(x=>x.band===current&&(!since||x.at>since));
  const unique=[];const used=new Set();
  for(let i=bandAttempts.length-1;i>=0&&unique.length<5;i--){
   if(!used.has(bandAttempts[i].word)){unique.unshift(bandAttempts[i]);used.add(bandAttempts[i].word)}
  }
  if(unique.length>=4){
   const scored=unique.slice(-5),right=scored.filter(x=>x.correct).length,wrong=scored.length-right;
   const pos=BANDS.indexOf(current);
   const up=(scored.length===5&&right>=4)||(scored.length===4&&right===4);
   const down=wrong>=3&&scored.length>=4;
   const move=up&&pos<BANDS.length-1?pos+1:down&&pos>0?pos-1:pos;
   if(move!==pos){
    const to=BANDS[move];
    state.moves.push({from:current,to,at:new Date().toISOString(),evidence:{attempts:scored.length,correct:right},reason:up?'confident_independent_accuracy':'support_needed'});
    state.currentBand=to;
   }
  }
 }
 state.updatedAt=new Date().toISOString();
 return savePlacement(storage,profile,state);
}
function pool(allWords,history,placement){
 if(!Array.isArray(allWords)||!allWords.length)return [];
 const band=validBand(placement?.currentBand)?placement.currentBand:'year3_4';
 const current=allWords.filter(w=>w.band===band&&!history?.[w.word]?.events?.length);
 const known=allWords.filter(w=>history?.[w.word]?.events?.length);
 const prior=PILOT.reduce((acc,w,i)=>(acc[w]=i,acc),{});
 current.sort((a,b)=>{
  const ai=prior[a.word],bi=prior[b.word];if(ai!==undefined||bi!==undefined)return (ai??1000)-(bi??1000);
  const role=w=>w.curriculumRole==='common_exception'?0:w.curriculumRole==='statutory_wordlist'?1:2;
  return role(a)-role(b)||a.word.length-b.word.length||a.word.localeCompare(b.word);
 });
 // Previously learned words always remain candidates (including other bands).
 const added=new Set();return [...known,...current].filter(w=>{if(added.has(w.word))return false;added.add(w.word);return true});
}
return {BANDS,ageStartingBand,yearStartingBand,starter,prepare,seedPreference,
 placementKey,readPlacement,savePlacement,resetStartingPoint,recordIndependent,pool};
});
