'use strict';
/** Visual memory chunks ONLY; never sound syllables or phonemes.
 * User selections are scoped by learner ID/word ID and stored by a caller-provided adapter.
 */
function validatePositions(spelling,positions,{maxDividers=4}={}){
 if(typeof spelling!=='string'||!/^[a-z]+(?:'[a-z]+)?$/i.test(spelling))throw Error('Approved spelling required');
 if(!Array.isArray(positions)||positions.length>maxDividers)throw Error('Too many visual dividers');
 if(positions.some(p=>!Number.isInteger(p)||p<1||p>=spelling.length))throw Error('Invalid divider position');
 if(new Set(positions).size!==positions.length)throw Error('Duplicate divider position');
 if(positions.some((p,i)=>i>0&&p<positions[i-1]))throw Error('Dividers must be sorted');
 return positions.slice();
}
function groupsFromPositions(spelling,positions){
 const cuts=validatePositions(spelling,positions);
 return [0,...cuts,spelling.length].slice(0,-1).map((start,i,arr)=>spelling.slice(start,[...cuts,spelling.length][i]));
}
function saveVisualPreference({learnerId,wordId,spelling,positions,save,now=new Date().toISOString()}={}){
 if(!/^lp-[a-z0-9]+$/.test(String(learnerId||'')))throw Error('Scoped learner ID required');
 if(!/^en-[a-z0-9-]+$/.test(String(wordId||'')))throw Error('Word ID required');
 if(typeof save!=='function')throw Error('Storage adapter required');
 const checked=validatePositions(spelling,positions);
 const entry={learnerId,wordId,spelling,positions:checked,kind:'visual_memory_chunks',teachingClaims:false,
  speaksChunks:false,independentMasteryEvidence:false,version:1,updatedAt:now};
 save(learnerId,wordId,entry);
 return entry;
}
function loadVisualPreference({learnerId,wordId,spelling,load}={}){
 if(typeof load!=='function')throw Error('Storage adapter required');
 const saved=load(learnerId,wordId);
 if(!saved||saved.learnerId!==learnerId||saved.wordId!==wordId||saved.spelling!==spelling||
    saved.kind!=='visual_memory_chunks')return null;
 try{validatePositions(spelling,saved.positions);return saved}catch{return null}
}
module.exports={validatePositions,groupsFromPositions,saveVisualPreference,loadVisualPreference};
