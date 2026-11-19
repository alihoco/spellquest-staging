/* Staging-only visual spelling chunks. Never a phoneme/syllable teaching source.
   Private browser tester data; not secure accounts or enrolled research. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterChunkUI=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const PREFIX='spellmaster-local-splitter-v1:';
 const validCuts=(word,cuts)=>Array.isArray(cuts)&&cuts.length<=4&&cuts.every((x,i)=>Number.isInteger(x)&&x>0&&x<word.length&&(i===0||x>cuts[i-1]));
 const fromChunks=(word,chunks)=>{
  if(!Array.isArray(chunks)||chunks.join('')!==word)return [];
  let offset=0;return chunks.slice(0,-1).map(x=>(offset+=x.length));
 };
 const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
 const groups=(word,cuts)=>{if(!validCuts(word,cuts))throw Error('Invalid visual grouping');return [0,...cuts].map((start,i)=>word.slice(start,[...cuts,word.length][i]));};
 function key(profile){if(!profile||!/^lp-[a-z0-9]+$/.test(profile.id))throw Error('Local tester profile required');return PREFIX+profile.id;}
 function read(storage,profile){try{const v=JSON.parse(storage.getItem(key(profile))||'{}');return {preferences:v.preferences||{},events:Array.isArray(v.events)?v.events:[]}}catch{return {preferences:{},events:[]}}}
 function write(storage,profile,state){storage.setItem(key(profile),JSON.stringify(state))}
 function log(storage,profile,action,word,opportunity,extra={}){
  const state=read(storage,profile);
  if(['offered','opened','custom_reused'].includes(action)&&state.events.some(e=>e.action===action&&e.opportunity===opportunity))return state;
  state.events.push({action,word,opportunity,at:new Date().toISOString(),...extra});
  state.events=state.events.slice(-1500);write(storage,profile,state);return state;
 }
 function choice(storage,profile,word,defaultCuts,selectedCuts,opportunity){
  if(!validCuts(word,defaultCuts)||!validCuts(word,selectedCuts))throw Error('Invalid grouping');
  const state=read(storage,profile),custom=!same(defaultCuts,selectedCuts);
  const prior=state.preferences[word];
  const sameAsPrior=!!prior&&same(prior.cuts,selectedCuts);
  state.preferences[word]={spelling:word,cuts:selectedCuts.slice(),defaultCuts:defaultCuts.slice(),custom,
   lastSavedOpportunity:opportunity,savedAt:new Date().toISOString(),revisions:(prior?.revisions||0)+(sameAsPrior?0:1)};
  write(storage,profile,state);
  log(storage,profile,sameAsPrior?'previous_grouping_confirmed':custom?'custom_saved':'default_kept',word,opportunity,{changed:custom&&!sameAsPrior});
  if(prior?.custom&&!custom)log(storage,profile,'custom_reset',word,opportunity);
  if(prior?.custom&&custom&&!same(prior.cuts,selectedCuts))log(storage,profile,'custom_revised',word,opportunity);
  return {custom,cuts:selectedCuts.slice()};
 }
 function summary(state){
  const events=state.events||[];
  const count=a=>events.filter(e=>e.action===a).length;
  const offered=new Set(events.filter(e=>e.action==='offered').map(x=>x.opportunity));
  const changed=new Set(events.filter(e=>e.action==='custom_saved').map(x=>x.opportunity));
  return {offered:offered.size,opened:count('opened'),edited:count('edited'),
   changedOpportunities:changed.size,customSaves:count('custom_saved'),
   keptDefault:count('default_kept'),reuses:count('custom_reused'),resets:count('custom_reset'),
   changeRate:offered.size?changed.size/offered.size:null};
 }
 function mount({host,word,teacherChunks,profile,storage,opportunity,onNotice,onSpeakInstruction,onGroupingSaved,onGroupingExposed}){
  if(!host||!word||!profile)return;
  const defaultCuts=fromChunks(word,teacherChunks);
  if(!validCuts(word,defaultCuts))return;
  const state=read(storage,profile),previous=state.preferences[word];
  const saved=previous&&previous.spelling===word&&validCuts(word,previous.cuts)?previous:null;
  const initial=saved?saved.cuts.slice():defaultCuts.slice();
  const root=document.createElement('section');root.className='chunk-workshop';
  root.innerHTML='<div class="chunk-head"><div><strong>Make your own word groups</strong><p class="small muted">Keep these groups or make a pattern that helps you remember.</p></div>'+
   '<button class="alt tiny-action chunk-open" type="button">✦ Try splitting</button></div><div class="chunk-editor" hidden></div>';
  host.append(root);
  log(storage,profile,'offered',word,opportunity);
  // The actual spelling groups have been shown in the supported lesson.
  if(typeof onGroupingExposed==='function')onGroupingExposed({word,opportunity,selectedCuts:initial,defaultCuts:defaultCuts.slice(),reason:'supported_review'});
  const editor=root.querySelector('.chunk-editor'),open=root.querySelector('.chunk-open');
  if(typeof onSpeakInstruction==='function'){
   const listen=document.createElement('button');listen.type='button';listen.className='alt tiny-action';
   listen.textContent='🔊 How to split';listen.setAttribute('aria-label','Hear how to make your own word groups');
   listen.addEventListener('click',onSpeakInstruction);root.querySelector('.chunk-head').append(listen);
  }
  const status=document.createElement('p');status.className='small muted chunk-notice';status.setAttribute('role','status');root.append(status);
  let cuts=initial.slice(),edited=false;
  function paint(){
   editor.replaceChildren();
   const hint=document.createElement('p');hint.className='small muted';hint.textContent='Tap between letters to add or remove dividers. You can also drag a divider to a new gap.';editor.append(hint);
   const line=document.createElement('div');line.className='chunk-letters';
   for(let i=0;i<word.length;i++){
    const l=document.createElement('span');l.className='chunk-letter';l.textContent=word[i];line.append(l);
    if(i===word.length-1)continue;
    const p=i+1,has=cuts.includes(p),button=document.createElement('button');
    button.className='chunk-boundary'+(has?' active':'');button.type='button';button.textContent=has?'│':'·';
    button.setAttribute('aria-label',(has?'Remove':'Add')+' divider after letter '+p);
    button.title=has?'Drag or tap to remove':'Tap to add divider';
    button.setAttribute('aria-pressed',String(has));button.draggable=has;
    button.addEventListener('click',()=>{cuts=has?cuts.filter(x=>x!==p):[...cuts,p].sort((a,b)=>a-b);
      if(cuts.length>4){cuts=cuts.filter(x=>x!==p);return}edited=true;log(storage,profile,'edited',word,opportunity);paint()});
    button.addEventListener('dragstart',e=>{if(has)e.dataTransfer.setData('text/plain',String(p))});
    button.addEventListener('dragover',e=>e.preventDefault());
    button.addEventListener('drop',e=>{e.preventDefault();const old=Number(e.dataTransfer.getData('text/plain'));
      if(!Number.isInteger(old)||!cuts.includes(old))return;
      cuts=[...new Set(cuts.filter(x=>x!==old).concat([p]))].sort((a,b)=>a-b);
      edited=true;log(storage,profile,'edited',word,opportunity);paint()});
    line.append(button);
   }
   editor.append(line);
   const preview=document.createElement('div');preview.className='chunk-preview';
   groups(word,cuts).forEach(g=>{const span=document.createElement('span');span.textContent=g;preview.append(span)});
   editor.append(preview);
   const buttons=document.createElement('div');buttons.className='actions';
   const save=document.createElement('button');save.type='button';save.textContent='Use my groups';save.onclick=()=>{
     const result=choice(storage,profile,word,defaultCuts,cuts,opportunity);
     if(onNotice)onNotice(result.custom?'Your groups are saved for next time.':'You kept the suggested groups.');
     if(typeof onGroupingSaved==='function')onGroupingSaved({word,opportunity,cuts:result.cuts,custom:result.custom,defaultCuts:defaultCuts.slice()});
     if(typeof onGroupingExposed==='function')onGroupingExposed({word,opportunity,selectedCuts:result.cuts,defaultCuts:defaultCuts.slice(),reason:'saved_selection'});
     root.querySelector('.chunk-head p').textContent=result.custom?'Your own grouping is saved.':'The suggested grouping is saved.';
     editor.hidden=true;open.textContent='✦ Change my groups';
   };
   const reset=document.createElement('button');reset.type='button';reset.className='alt';reset.textContent='Suggested written groups';
   reset.onclick=()=>{cuts=defaultCuts.slice();edited=true;log(storage,profile,'edited',word,opportunity);paint()};
   const close=document.createElement('button');close.type='button';close.className='alt';close.textContent='Not now';close.onclick=()=>{
     log(storage,profile,'skipped',word,opportunity);editor.hidden=true;
   };
   buttons.append(save,reset,close);editor.append(buttons);
   const foot=document.createElement('p');foot.className='small muted';foot.textContent='These are suggested written memory groups, not verified syllables or spoken sounds. Spelling checks still happen with the whole word hidden.';editor.append(foot);
  }
  open.onclick=()=>{
    editor.hidden=!editor.hidden;
    if(!editor.hidden){
      log(storage,profile,'opened',word,opportunity);
      if(saved?.custom&&saved.lastSavedOpportunity!==opportunity)log(storage,profile,'custom_reused',word,opportunity);
      paint();
    }
  };
  if(saved?.custom)root.querySelector('.chunk-head p').textContent='Your saved grouping is ready to use again.';
  return root;
 }
 return {fromChunks,validCuts,groups,read,log,choice,summary,mount,key};
});
