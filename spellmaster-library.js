/* Magical Library lesson shell. PRESENTATION ONLY: all spelling, audio,
   recall, bonus and learner-data functions remain in the original game. */
(function(){
 'use strict';
 const app=document.getElementById('app'),main=document.querySelector('main'),hero=main?.querySelector('.hero');
 if(!app||!main)return;
 const path=document.createElement('nav');path.className='sm-path';path.setAttribute('aria-label','Word journey progress');
 path.innerHTML='<span class="sm-path-head">✦ Your spelling adventure</span><div class="sm-path-track" id="sm-path-track"></div>';
 hero.after(path);
 const layout=document.createElement('div');layout.className='sm-layout';
 app.before(layout);
 const character=document.createElement('aside');character.className='sm-character';character.setAttribute('aria-label','Your explorer');
 character.innerHTML='<div class="sm-avatar-card"><img class="sm-avatar-illustration" src="/assets/spellmaster/explorer-painted.webp" alt="Friendly illustrated word explorer holding a magical book" loading="eager"><div class="sm-character-text"><h3>Meet your explorer</h3><p class="sm-avatar-sub">An adventure to remember your words</p><span class="sm-avatar-pill">✦ Word Explorer</span></div></div>'+
 '<div class="sm-character-hint"><strong>✦ Better today than yesterday</strong><p>Look for the little steps forward. Your explorer will celebrate what you learn.</p></div>';
 const side=document.createElement('aside');side.className='sm-side';side.setAttribute('aria-label','Adventure and rewards');
 side.innerHTML='<details class="sm-side-box" id="sm-adventure"><summary>🗺️ Your Adventure</summary><div class="sm-side-body"><ul id="sm-journey-list"></ul><div class="sm-mini-meter"><span id="sm-journey-meter"></span></div><small id="sm-journey-caption">Your personal journey</small></div></details>'+
 '<details class="sm-side-box satchel-card" id="sm-rewards"><summary><img class="purse-art" src="/assets/spellmaster/explorer-purse.webp" alt=""><span>Your Rewards<strong><span id="sm-coin-count">0</span> coins</strong></span></summary><div class="sm-side-body"><div class="satchel-stats"><span><b id="sm-point-count">0</b>Bonus points</span><span><b id="sm-item-count">0</b>Wardrobe items</span></div></div></details>'+
 '<details class="sm-side-box wardrobe-card" id="sm-profile"><summary>Your Explorer</summary><div class="sm-side-body"><div class="wardrobe-portrait" aria-hidden="true"></div><strong id="sm-profile-name">Explorer</strong><button type="button" id="sm-open-shop">Visit Explorer Shop</button></div></details>';
 side.querySelector('#sm-open-shop').onclick=()=>openExplorerShop();
 const defaultPortrait=character.querySelector('.sm-avatar-illustration');
 const portraitFrame=document.createElement('div');portraitFrame.className=defaultPortrait.className;
 defaultPortrait.replaceWith(portraitFrame);defaultPortrait.removeAttribute('class');portraitFrame.append(defaultPortrait);
 layout.append(character,app,side);
 const isMobile=window.matchMedia('(max-width:780px)').matches;
 for(const detail of side.querySelectorAll('details'))detail.open=!isMobile;
 const nodeTrack=path.querySelector('#sm-path-track');
 const list=side.querySelector('#sm-journey-list');
 let lastSignature='',scheduled=false;
 function text(id,value){const el=side.querySelector('#'+id);if(el)el.textContent=value}
 function state(){
  const storage=window.SpellmasterAccount?.token()?sessionStorage:localStorage;
  const profile=window.SpellmasterProfiles?.active(storage);
  const currentStage=typeof stage==='string'?stage:'welcome';
  const count=typeof runCount==='number'?runCount:0;
  const outcomes=typeof runResults!=='undefined'&&Array.isArray(runResults)?runResults:[];
  const bonus=profile&&window.SpellmasterBonus?window.SpellmasterBonus.read(storage,profile):null;
  const active=currentStage!=='welcome'&&currentStage!=='finished'&&count>0;
  return {profile,currentStage,count,outcomes,bonus,active};
 }
 function render(){
  scheduled=false;const v=state(),done=v.outcomes.filter(x=>x.learned).length;
  // A five-stop rolling window: no implied ten-word limit.
  const firstVisible=v.active?Math.max(1,v.count-2):1;
  const lastVisible=firstVisible+4;
  const signature=JSON.stringify([v.profile?.id||'none',v.profile?.alias||'',v.profile?.theme||'',v.currentStage,v.count,done,
    v.bonus?.coins||0,v.bonus?.bonusPoints||0,v.bonus?.inventory?.length||0,v.bonus?.explorerStyle,v.bonus?.equipped,v.bonus?.colours]);
  if(signature===lastSignature)return;
  lastSignature=signature;
  const holder=character.querySelector('.sm-avatar-illustration');
  if(window.ExplorerCreator?.valid(v.bonus?.explorerStyle)){
   holder.replaceChildren(ExplorerCreator.sprite(v.bonus.explorerStyle,v.bonus.equipped,v.bonus.colours));
  }else holder.replaceChildren(defaultPortrait.cloneNode());
  side.querySelector('.wardrobe-portrait').replaceChildren(holder.firstElementChild.cloneNode(true));
  nodeTrack.replaceChildren();list.replaceChildren();
  for(let i=firstVisible;i<=lastVisible;i++){
   const complete=v.active&&i<v.count;
   const current=(v.active&&i===v.count)||(!v.active&&v.currentStage==='welcome'&&i===1);
   const box=document.createElement('div');box.className='sm-node '+(complete?'done':current?'active':'future');
   if(current)box.setAttribute('aria-current','step');
   const circle=document.createElement('span');circle.className='sm-node-circle';
   circle.textContent=complete?'✓':current?'★':String(i);
   const label=document.createElement('span');label.className='sm-node-label';label.textContent='Word '+i;
   box.append(circle,label);nodeTrack.append(box);
   if(i>=firstVisible&&i<=lastVisible){
    const item=document.createElement('li');
    const marker=document.createElement('span');marker.className='sm-list-mark';
    marker.textContent=complete?'✓':current?'➜':'○';
    const copy=document.createElement('span');copy.textContent='Word '+i+(current?' · Current':'');
    item.append(marker,copy);list.append(item);
   }
  }
  const pathTitle=path.querySelector('.sm-path-head');
  if(pathTitle)pathTitle.textContent=v.currentStage.startsWith('bonus')?'🏆 Bonus memory challenge':v.currentStage==='welcome'?'✦ Your spelling adventure':'✦ Your word journey';
  const meter=side.querySelector('#sm-journey-meter');
  if(meter)meter.style.width=(v.active?Math.min(100,(((v.count-1)%5)+1)*20):0)+'%';
  text('sm-journey-caption',v.active?'Word '+v.count+' of this adventure · No race to finish':'Learn at your own pace');
  text('sm-coin-count',String(v.bonus?.coins||0));
  text('sm-point-count',String(v.bonus?.bonusPoints||0));
  text('sm-item-count',String(v.bonus?.inventory?.length||0));
  text('sm-profile-name',v.profile?.alias||'Your explorer');
  const avatarTitle=character.querySelector('h3');
  if(avatarTitle)avatarTitle.textContent=v.profile?.alias?('Explorer '+v.profile.alias):'Meet your explorer';
  document.body.dataset.smStage=v.currentStage;
  character.classList.toggle('is-celebrating',v.currentStage==='success'||v.currentStage==='bonus-result');
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(render)}
 const observer=new MutationObserver(schedule);observer.observe(app,{childList:true,subtree:true,characterData:true});
 window.addEventListener('explorer-changed',schedule);
 window.addEventListener('resize',schedule,{passive:true});
 schedule();
})();

// The wallet is credited by the lesson. This effect only illustrates that deposit.
window.SpellmasterCoinFlight=function(amount,origin){
 const receipt=document.querySelector('#app .reward-receipt');
 if(!receipt||!amount||!origin)return;
 let bag=document.querySelector('#sm-rewards .purse-art');
 if(!bag)return;
 const rect=bag.getBoundingClientRect();
 let pocket=null;
 if(!rect.width||rect.top<0||rect.bottom>innerHeight||rect.right>innerWidth){
  pocket=document.createElement('span');pocket.className='pocket-deposit';
  pocket.setAttribute('aria-hidden','true');
  bag=bag.cloneNode();pocket.append(bag);
  const row=document.createElement('div');row.className='pocket-deposit-row';
  receipt.before(row);row.append(receipt,pocket);
 }
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.dataset.theme==='focus'||!bag.animate)return;
 const end=bag.getBoundingClientRect();
 const {x,y}=origin;
 const dx=end.left+end.width*.5-x,dy=end.top+end.height*.32-y;
 const count=Math.min(5,amount);
 for(let i=0;i<count;i++){
  const coin=document.createElement('span');coin.className='flying-spell-coin';coin.textContent='✦';
  coin.setAttribute('aria-hidden','true');coin.style.left=x+'px';coin.style.top=y+'px';document.body.append(coin);
  const flight=coin.animate([
   {transform:'translate(-50%,-50%) scale(.72)',opacity:0},
   {offset:.15,transform:'translate('+dx*.09+'px,'+(dy*.09-22)+'px) rotate(-16deg)',opacity:1},
   {offset:.55,transform:'translate('+dx*.5+'px,'+(dy*.5-42-i*3)+'px) rotate(22deg)',opacity:1},
   {transform:'translate('+dx+'px,'+dy+'px) scale(.26)',opacity:0}
  ],{duration:590,delay:i*55,easing:'ease-in-out',fill:'both'});
  flight.onfinish=()=>{coin.remove();if(i===count-1&&bag.isConnected)bag.animate([{transform:'scale(1)'},{transform:'scale(1.09) rotate(3deg)'},{transform:'scale(1)'}],220)};
  flight.oncancel=()=>coin.remove();
 }
};
