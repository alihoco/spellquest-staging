/* Spellmaster: optional accessible read-aloud and keyboard-ready spelling inputs. */
(()=>{
 'use strict';
 const app=document.getElementById('app');
 if(!app)return;
 let lastField=null;
 function speakText(el){
  if(!('speechSynthesis' in window)){alert('Read aloud is not supported in this browser.');return;}
  const text=el.textContent.replace(/🔊\s*Read aloud/g,'').trim();
  if(!text)return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='en-GB';utterance.rate=.88;
  const preferred=window.speechSynthesis.getVoices().find(v=>v.lang?.toLowerCase().startsWith('en-gb'));
  if(preferred)utterance.voice=preferred;
  window.speechSynthesis.speak(utterance);
 }
 function enhance(){
  const input=app.querySelector('#answer, #bonus-answer');
  if(input&&input!==lastField){
   lastField=input;
   requestAnimationFrame(()=>{if(input.isConnected&&!document.hidden&&!(document.activeElement?.matches('input,textarea,[contenteditable="true"]')))input.focus({preventScroll:true});});
  }
  app.querySelectorAll('h2, .start-desc, .note, p').forEach(el=>{
   if(el.dataset.readButton||el.closest('.voice, .profile-form, .tester-profile-tools, .chunk-workshop')||el.textContent.trim().length<32)return;
   el.dataset.readButton='yes';
   const b=document.createElement('button');
   b.type='button';b.className='spellmaster-read-btn';
   b.textContent='🔊 Read aloud';
   b.setAttribute('aria-label','Read this text aloud');
   b.addEventListener('click',()=>speakText(el));
   el.insertAdjacentElement('afterend',b);
  });
 }
 const styles=document.createElement('style');
 styles.textContent='.spellmaster-read-btn{display:inline-flex;align-items:center;min-height:34px;padding:6px 12px;font-size:12px;margin:2px 8px 12px 0;border-radius:20px;background:#eae7ff;color:#382d78;font-weight:800}.spellmaster-read-btn:focus-visible{outline:3px solid #efbb56;outline-offset:2px}';
 document.head.append(styles);
 let pending=false;
 new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhance()})}).observe(app,{childList:true,subtree:true});
 enhance();
})();
