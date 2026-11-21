/* Spellmaster's shared friendly narrator and compact, accessible speaker icons.
 * Narration is opt-in. Never reads entered inputs, recovery codes or personal profiles.
 */
(function(root){
 'use strict';
 const API='https://spellquest-voice-staging.onrender.com/api/read-aloud';
 let player=null,controller=null,requestNo=0,activeButton=null,voiceFallback=null;
 const compactSelector='h1,h2,h3,[data-read-aloud]';
 const prohibited='.profile-form,.tester-profile-tools,.active-learner,.condition-status,.condition-row,.voice,.privacy-note,#neuro,#signup-complete,#login,#members,#condition-form,.profile-choice,.account-row,[data-no-read],input,textarea,select';
 const speaker='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
 let releasePlayback=null;
 function stop(){
  if(releasePlayback){releasePlayback(false);releasePlayback=null}
  requestNo++;
  if(root.speechSynthesis){root.speechSynthesis.cancel();voiceFallback=null}
  if(controller){controller.abort();controller=null}
  if(player){player.pause();player=null}
  if(activeButton){activeButton.removeAttribute('aria-pressed');activeButton.classList.remove('speaking');activeButton=null}
 }
 function plainText(element){
  const cloned=element.cloneNode(true);
  cloned.querySelectorAll('button,input,textarea,select,script,svg,[aria-hidden="true"],.spellmaster-speaker').forEach(node=>node.remove());
  return (cloned.textContent||'').replace(/\s+/g,' ').trim().slice(0,650);
 }
 function readableText(element){
  if(element.matches('[role="alert"]')||(element.matches('[role="status"]')&&!element.matches('#save-status')))return '';
  if(element.closest(prohibited)||element.closest('.hidden,[hidden]')||element.closest('[data-no-auto-speaker]'))return '';
  let text=plainText(element);
  if(!text||text.length<8||text.length>650)return '';
  if(/Ready to discover,/i.test(text))text='Ready to discover?';
  return text;
 }
 function sectionText(el){
  const pieces=[readableText(el)];
  if(el.matches('h1,h2,h3')){
   let node=el.nextElementSibling,shown=0;
   while(node&&shown<3){
    if(node.matches('h1,h2,h3,section,div,form,button,details,nav,ul,ol'))break;
    if(node.matches('p,.start-desc')&&!node.closest(prohibited)&&!node.matches('[role="alert"],[role="status"]')){
     const text=plainText(node);if(text)pieces.push(text);shown++;
    }
    node=node.nextElementSibling;
   }
  }
  return pieces.filter(Boolean).join('. ').slice(0,650);
 }
 function browserFallback(text,n){
  if(!root.speechSynthesis||!root.SpeechSynthesisUtterance)return Promise.resolve(false);
  return new Promise(resolve=>{
   const utterance=new SpeechSynthesisUtterance(text);
   utterance.lang='en-GB';utterance.rate=.9;utterance.pitch=1;
   const voices=root.speechSynthesis.getVoices();
   utterance.voice=voices.find(v=>v.lang.toLowerCase()==='en-gb')||voices.find(v=>v.lang.toLowerCase().startsWith('en'))||null;
   voiceFallback=utterance;
   utterance.onend=()=>{if(n===requestNo)voiceFallback=null;resolve(n===requestNo)};
   utterance.onerror=()=>{if(n===requestNo)voiceFallback=null;resolve(false)};
   root.speechSynthesis.speak(utterance);
  });
 }
 async function speak(text,button){
  if(typeof text!=='string'||!text.trim())return false;
  stop();
  const n=requestNo,voice=sessionStorage.getItem('spellquest-ai-voice')||'marin';
  text=text.replace(/[<>\x00-\x1f]/g,' ').replace(/\s+/g,' ').trim().slice(0,650);
  if(button){activeButton=button;button.setAttribute('aria-pressed','true');button.classList.add('speaking')}
  try{
   controller=new AbortController();
   const r=await fetch(API,{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,650),voice}),signal:controller.signal});
   if(!r.ok)throw Error('Narrator is unavailable');
   const audioBlob=await r.blob();
   if(n!==requestNo)return false;
   const url=URL.createObjectURL(audioBlob),audio=new Audio(url);player=audio;
   const completed=new Promise(resolve=>{
    releasePlayback=ok=>{audio.onended=null;audio.onerror=null;URL.revokeObjectURL(url);resolve(ok)};
    audio.onended=()=>{if(player===audio){releasePlayback(true);releasePlayback=null;stop()}};
    audio.onerror=()=>{if(player===audio)stop()};
   });
   try{await audio.play()}catch(error){
    if(player===audio){releasePlayback(false);releasePlayback=null;player=null}
    throw error;
   }
   return await completed;
  }catch(error){
   if(n!==requestNo)return false;
   // Fall back to an installed British browser voice if the cloud narrator
   // is rate-limited or temporarily unavailable. Never leave the child in silence.
   const status=document.getElementById('read-aloud-status');
   if(status)status.textContent='Using your device voice while the narrator is unavailable.';
   const ok=await browserFallback(text,n);
   if(n===requestNo&&activeButton){activeButton.removeAttribute('aria-pressed');activeButton.classList.remove('speaking');activeButton=null}
   if(!ok&&status&&n===requestNo)status.textContent='Speech could not start. Check device volume and try again.';
   return ok;
  }
 }
 function addIcons(container){
  if(!container)return;
  container.querySelectorAll(compactSelector).forEach(el=>{
   if(el.dataset.speakerReady==='1')return;
   if(!readableText(el))return;
   el.dataset.speakerReady='1';
   const button=document.createElement('button');
   button.type='button';button.className='spellmaster-speaker';
   const label=(el.getAttribute('data-speak-label')||'Hear '+(plainText(el).slice(0,55)||'this section')).trim();
   button.setAttribute('aria-label',label);
   button.setAttribute('title',label);
   button.setAttribute('aria-pressed','false');
   button.innerHTML=speaker;
   button.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    if(activeButton===button){stop();return}
    if(typeof root.SpellmasterLessonAudioStop==='function')root.SpellmasterLessonAudioStop();
    speak(sectionText(el),button);
   });
   el.insertBefore(button,el.firstChild);
  });
 }
 function init(){
  const style=document.createElement('style');
  style.textContent='.spellmaster-speaker{display:inline-flex!important;vertical-align:middle;align-items:center;justify-content:center;flex:0 0 44px;width:44px!important;height:44px!important;min-height:44px!important;min-width:44px!important;padding:9px!important;margin:0 5px 2px 0!important;border:0!important;border-radius:12px!important;background:#f5dc94!important;color:#4b2862!important;box-shadow:none!important;cursor:pointer!important;line-height:1!important}.spellmaster-speaker:hover,.spellmaster-speaker.speaking{background:#f0b849!important}.spellmaster-speaker:focus-visible{outline:3px solid #7554c4!important;outline-offset:2px!important}.spellmaster-speaker svg{width:18px!important;height:18px!important}h1>.spellmaster-speaker,h2>.spellmaster-speaker,h3>.spellmaster-speaker{vertical-align:middle}#read-aloud-status{position:absolute;clip:rect(0,0,0,0);width:1px;height:1px;overflow:hidden}';
  document.head.append(style);
  const status=document.createElement('span');status.id='read-aloud-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.append(status);
  addIcons(document.querySelector('main'));
  const main=document.querySelector('main');
  if(main){let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;addIcons(main)})}).observe(main,{childList:true,subtree:true})}
 }
 root.SpellmasterReader={speak,stop,addIcons};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(window);
