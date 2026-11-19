/* Spellmaster's shared friendly narrator and compact, accessible speaker icons.
 * Narration is opt-in. Never reads entered inputs, recovery codes or personal profiles.
 */
(function(root){
 'use strict';
 const API='https://spellquest-voice-staging.onrender.com/api/read-aloud';
 let player=null,controller=null,requestNo=0,activeButton=null;
 const compactSelector='h1,h2,h3,p,.start-desc,.chapter-title';
 const prohibited='.profile-form,.tester-profile-tools,.active-learner,.condition-status,.condition-row,.voice,.privacy-note,#neuro,#signup-complete,#login,#members,#condition-form,.profile-choice,.account-row,[data-no-read],input,textarea,select';
 const speaker='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
 function stop(){
  requestNo++;
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
  if(element.closest(prohibited))return '';
  let text=plainText(element);
  if(!text||text.length<12||text.length>650)return '';
  if(/Ready to discover,/i.test(text))text='Ready to discover?';
  return text;
 }
 async function speak(text,button){
  if(typeof text!=='string'||!text.trim())return false;
  stop();
  const n=requestNo,voice=sessionStorage.getItem('spellquest-ai-voice')||'marin';
  if(button){activeButton=button;button.setAttribute('aria-pressed','true');button.classList.add('speaking')}
  try{
   controller=new AbortController();
   const r=await fetch(API,{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,650),voice}),signal:controller.signal});
   if(!r.ok)throw Error('Narrator is unavailable');
   const audioBlob=await r.blob();
   if(n!==requestNo)return false;
   const url=URL.createObjectURL(audioBlob),audio=new Audio(url);player=audio;
   audio.onended=()=>{URL.revokeObjectURL(url);if(player===audio)stop()};
   audio.onerror=()=>{URL.revokeObjectURL(url);if(player===audio)stop()};
   await audio.play();
   return true;
  }catch(error){
   if(n===requestNo){
    stop();
    const message='The friendly narrator is unavailable right now. Please try again.';
    const status=document.getElementById('read-aloud-status');
    if(status)status.textContent=message;
   }
   return false;
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
   button.setAttribute('aria-label','Listen to this text');
   button.setAttribute('title','Listen to this text');
   button.setAttribute('aria-pressed','false');
   button.innerHTML=speaker;
   button.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();
    if(activeButton===button){stop();return}
    if(typeof root.stop==='function'&&container.id==='app')root.stop();
    speak(readableText(el),button);
   });
   el.insertBefore(button,el.firstChild);
  });
 }
 function init(){
  const style=document.createElement('style');
  style.textContent='.spellmaster-speaker{display:inline-flex!important;vertical-align:middle;align-items:center;justify-content:center;flex:0 0 auto;width:30px!important;height:30px!important;min-height:30px!important;min-width:30px!important;padding:3px!important;margin:0 7px 2px 0!important;border:0!important;border-radius:9px!important;background:#f5dc94!important;color:#4b2862!important;box-shadow:none!important;cursor:pointer!important;line-height:1!important}.spellmaster-speaker:hover,.spellmaster-speaker.speaking{background:#f0b849!important}.spellmaster-speaker:focus-visible{outline:3px solid #7554c4!important;outline-offset:2px!important}.spellmaster-speaker svg{width:18px!important;height:18px!important}h1>.spellmaster-speaker,h2>.spellmaster-speaker,h3>.spellmaster-speaker{vertical-align:middle}#read-aloud-status{position:absolute;clip:rect(0,0,0,0);width:1px;height:1px;overflow:hidden}@media(max-width:640px){.spellmaster-speaker{width:32px!important;height:32px!important;min-height:32px!important;min-width:32px!important;margin-right:5px!important}}';
  document.head.append(style);
  const status=document.createElement('span');status.id='read-aloud-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.append(status);
  addIcons(document.querySelector('main'));
  const main=document.querySelector('main');
  if(main){let scheduled=false;new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;addIcons(main)})}).observe(main,{childList:true,subtree:true})}
 }
 root.SpellmasterReader={speak,stop,addIcons};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(window);
