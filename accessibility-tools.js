/* Automatic spelling-input focus. Small speaker icons and narration are managed by spellmaster-reader.js. */
(()=>{
 'use strict';
 const app=document.getElementById('app');if(!app)return;
 let previous=null,pending=false;
 function focus(){
   const input=app.querySelector('#answer,#bonus-answer');
   if(!input||input===previous)return;
   previous=input;
   requestAnimationFrame(()=>{if(input.isConnected&&!document.hidden&&!document.activeElement?.matches('input,textarea,[contenteditable="true"]'))input.focus({preventScroll:true});});
 }
 new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;focus()})}).observe(app,{childList:true,subtree:true});
 focus();
})();
