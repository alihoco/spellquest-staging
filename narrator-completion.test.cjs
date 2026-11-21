const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');

test('bonus praise waits for the whole clip and a manual stop releases its caller',async()=>{
 let player;
 class Audio {
  constructor(){player=this}
  async play(){}
  pause(){}
 }
 const window={};
 const document={readyState:'loading',addEventListener(){}};
 vm.runInNewContext(fs.readFileSync(require.resolve('./spellmaster-reader.js'),'utf8'),{
  window,document,sessionStorage:{getItem:()=>null},Audio,AbortController,
  URL:{createObjectURL:()=>'clip',revokeObjectURL(){}},fetch:async()=>({ok:true,blob:async()=>({})})
 });
 const reader=window.SpellmasterReader;
 let settled=false;
 const full=reader.speak('Wow! Two out of two!').then(ok=>{settled=true;return ok});
 await new Promise(setImmediate);
 assert.equal(settled,false);
 player.onended();
 assert.equal(await full,true);
 const interrupted=reader.speak('Well done!');
 await new Promise(setImmediate);
 reader.stop();
 assert.equal(await interrupted,false);
});
