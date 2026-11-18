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
 character.innerHTML='<div class="sm-avatar-card"><img class="sm-avatar-illustration" src="/assets/spellmaster/explorer-guide.svg" alt="Friendly illustrated word explorer holding a magical book" loading="eager"><div class="sm-character-text"><h3>Meet your explorer</h3><p class="sm-avatar-sub">An adventure to remember your words</p><span class="sm-avatar-pill">✦ Word Explorer</span></div></div>'+
 '<div class="sm-character-hint"><strong>✦ Better today than yesterday</strong><p>Look for the little steps forward. Your explorer will celebrate what you learn.</p></div>';
 const side=document.createElement('aside');side.className='sm-side';side.setAttribute('aria-label','Adventure and rewards');
 side.innerHTML='<details class="sm-side-box" id="sm-adventure"><summary>🗺️ Your Adventure</summary><div class="sm-side-body"><ul id="sm-journey-list"></ul><div class="sm-mini-meter"><span id="sm-journey-meter"></span></div><small id="sm-journey-caption">Your personal journey</small></div></details>'+
 '<details class="sm-side-box" id="sm-rewards"><summary>🏆 Your Rewards</summary><div class="sm-side-body"><div class="sm-reward-row"><span class="sm-reward-icon">🪙</span><div><div class="sm-count" id="sm-coin-count">0</div><small>Coins from bonus rounds</small></div></div><div class="sm-reward-row"><span class="sm-reward-icon">✨</span><div><div class="sm-count" id="sm-item-count">0</div><small>Avatar items earned</small></div></div><small>Coins and cosmetics are separate from lasting spelling mastery.</small></div></details>'+
 '<details class="sm-side-box" id="sm-profile"><summary>🎒 Your Explorer</summary><div class="sm-side-body"><div class="sm-reward-row"><span class="sm-reward-icon">📖</span><div><strong id="sm-profile-name">Explorer</strong><small id="sm-profile-style">Your chosen style</small></div></div><small>Choose how the adventure looks from your local tester profile. A secure wardrobe will be added later.</small></div></details>';
 layout.append(character,app,side);
 const isMobile=window.matchMedia('(max-width:780px)').matches;
 for(const detail of side.querySelectorAll('details'))detail.open=!isMobile;
 const nodeTrack=path.querySelector('#sm-path-track');
 const list=side.querySelector('#sm-journey-list');
 let lastSignature='',scheduled=false;
 function text(id,value){const el=side.querySelector('#'+id);if(el)el.textContent=value}
 function state(){
  const profile=window.SpellmasterProfiles?.active(localStorage);
  const currentStage=typeof stage==='string'?stage:'welcome';
  const count=typeof runCount==='number'?runCount:0;
  const outcomes=typeof runResults!=='undefined'&&Array.isArray(runResults)?runResults:[];
  const bonus=profile&&window.SpellmasterBonus?window.SpellmasterBonus.read(localStorage,profile):null;
  const active=currentStage!=='welcome'&&currentStage!=='finished'&&count>0;
  return {profile,currentStage,count,outcomes,bonus,active};
 }
 function render(){
  scheduled=false;const v=state(),done=v.outcomes.filter(x=>x.learned).length;
  const previewCount=5;
  const total=Math.max(previewCount,Math.min(10,v.count+(v.currentStage==='bonus-question'?1:0)));
  const signature=JSON.stringify([v.profile?.id||'none',v.profile?.alias||'',v.profile?.theme||'',v.currentStage,v.count,done,
    v.bonus?.coins||0,v.bonus?.inventory?.length||0]);
  if(signature===lastSignature)return;
  lastSignature=signature;
  nodeTrack.replaceChildren();list.replaceChildren();
  for(let i=1;i<=total;i++){
   const complete=v.active&&i<v.count;
   const current=v.active&&i===v.count;
   const box=document.createElement('div');box.className='sm-node '+(complete?'done':current?'active':'future');
   if(current)box.setAttribute('aria-current','step');
   const circle=document.createElement('span');circle.className='sm-node-circle';
   circle.textContent=complete?'✓':current?'★':String(i);
   const label=document.createElement('span');label.className='sm-node-label';label.textContent='Word '+i;
   box.append(circle,label);nodeTrack.append(box);
   if(i<=5){
    const item=document.createElement('li');
    const marker=document.createElement('span');marker.className='sm-list-mark';
    marker.textContent=complete?'✓':current?'➜':'○';
    const copy=document.createElement('span');copy.textContent='Word '+i+(current?' · Current':'');
    item.append(marker,copy);list.append(item);
   }
  }
  const pathTitle=path.querySelector('.sm-path-head');
  if(pathTitle)pathTitle.textContent=v.currentStage.startsWith('bonus')?'🏆 Bonus memory challenge':v.currentStage==='welcome'?'✦ Your spelling adventure':'✦ Your word journey';
  const meter=side.querySelector('#sm-journey-meter');if(meter)meter.style.width=Math.min(100,Math.round((v.count>0?Math.max(v.count-1,0):0)/total*100))+'%';
  text('sm-journey-caption',v.active?'Word '+v.count+' of this adventure · No race to finish':'Learn at your own pace');
  text('sm-coin-count',String(v.bonus?.coins||0));
  text('sm-item-count',String(v.bonus?.inventory?.length||0));
  text('sm-profile-name',v.profile?.alias||'Your explorer');
  text('sm-profile-style',v.profile?('Theme: '+(v.profile.theme==='auto'?'Age-adjusted':v.profile.theme)):'Local tester profile');
  const avatarTitle=character.querySelector('h3');
  if(avatarTitle)avatarTitle.textContent=v.profile?.alias?('Explorer '+v.profile.alias):'Meet your explorer';
  document.body.dataset.smStage=v.currentStage;
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(render)}
 const observer=new MutationObserver(schedule);observer.observe(app,{childList:true,subtree:true,characterData:true});
 window.addEventListener('resize',schedule,{passive:true});
 schedule();
})();
