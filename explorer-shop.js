(function(root){
 'use strict';
 function open(profile,storage,afterClose,rewardId=null){
  const api=root.SpellmasterBonus;
  const dialog=document.createElement('dialog');dialog.className='explorer-studio explorer-shop';
  dialog.setAttribute('aria-label','Explorer shop');
  dialog.innerHTML='<header class="shop-head"><h2>Explorer shop</h2><p class="shop-balance"></p><button class="shop-close">Close</button></header><div class="shop-layout"><section class="shop-fitting"><div class="explorer-stage"></div><h3 class="shop-selection"></h3></section><div class="shop-stock"><label class="shop-filter">Show <select></select></label><div class="shop-items"></div><fieldset class="shop-colours"><legend>Item colour</legend></fieldset><button class="shop-action"></button><p role="status"></p></div></div>';
  document.body.append(dialog);
  const get=s=>dialog.querySelector(s);
  let selected=(rewardId&&api.availableChoices(storage,profile)[0])||api.AVATAR_ITEMS[0],busy=false,trying=true,draft=null;
  const filter=get('.shop-filter select');
  const sections={all:'All items',free:'Free starter items',hair:'Hair',hat:'Hats',coat:'T-shirts and jumpers',trousers:'Shorts and trousers',dress:'Dresses',shoes:'Footwear',glasses:'Glasses',hand:'Walking sticks',bag:'Bags'};
  function choices(){return rewardId?api.availableChoices(storage,profile):api.AVATAR_ITEMS}
  function matches(item,group){return group==='all'||(group==='free'?item.price===0:item.slot===group)}
  function setFilters(){
   filter.replaceChildren();
   for(const [group,label] of Object.entries(sections)){
    if(choices().some(item=>matches(item,group)))filter.add(new Option(label,group));
   }
  }
  setFilters();
  if(!rewardId&&!read().inventory.length){filter.value='free';selected=choices().find(item=>item.price===0)}
  filter.onchange=()=>{selected=choices().find(item=>matches(item,filter.value));draft=null;trying=true;get('[role=status]').textContent='';paint()};
  function read(){return profile?api.read(storage,profile):{coins:0,inventory:[],equipped:[]}}
  function paint(){
   const state=read(),worn=state.equipped||[],owned=state.inventory.includes(selected.id);
   const saved=state.colours?.[selected.id]||'original',colour=draft??saved;
   get('.shop-selection').textContent=selected.name;
   const swatches=get('.shop-colours');
   swatches.querySelectorAll('button').forEach(b=>b.remove());
   for(const name of api.COLOURS){
    const b=document.createElement('button');b.type='button';b.textContent=name[0].toUpperCase()+name.slice(1);
    b.setAttribute('aria-pressed',String(colour===name));b.dataset.tint=name;
    b.onclick=()=>{draft=name;trying=true;paint();swatches.querySelector('[aria-pressed=true]').focus()};
    swatches.append(b);
   }
   const avatar=root.ExplorerCreator.sprite(state.explorerStyle??0,trying?api.outfit(worn,selected):worn,{...state.colours,[selected.id]:colour});
   avatar.classList.add('walking');get('.explorer-stage').replaceChildren(avatar);
   get('.shop-balance').textContent=profile?'Your balance · '+state.coins+' coins':'Preview the items. Earn coins by spelling words.';
   get('.shop-items').replaceChildren();
   for(const item of choices().filter(item=>matches(item,filter.value))){
    const b=document.createElement('button');b.textContent=item.name;
    const art=document.createElement('span');art.className='shop-sample';art.setAttribute('aria-hidden','true');
    if(Number.isInteger(item.art)){
     art.classList.add('new-shop-sample');
     art.style.backgroundPosition=(item.art%4*100/3)+'% '+(Math.floor(item.art/4)*20)+'%';
    }else art.style.backgroundPositionX=(api.AVATAR_ITEMS.indexOf(item)*100/6)+'%';
    b.prepend(art);
    const price=document.createElement('small');price.textContent=rewardId?'Free reward':worn.includes(item.id)?'Wearing':state.inventory.includes(item.id)?'Owned':item.price?item.price+' coins':'Free';b.append(price);
    b.setAttribute('aria-pressed',String(item===selected));b.onclick=()=>{selected=item;draft=null;trying=true;get('[role=status]').textContent='';paint();get('.shop-items [aria-pressed=true]').focus()};get('.shop-items').append(b);
   }
   const action=get('.shop-action');
   action.textContent=rewardId?'Claim and wear for free':worn.includes(selected.id)?(colour!==saved?'Save colour':'Take off '+selected.name):owned?'Wear '+selected.name:selected.price===0?'Wear for free':'Buy and wear · '+selected.price+' coins';
   action.disabled=!profile||(!rewardId&&!owned&&state.coins<selected.price);
   if(profile&&!owned&&action.disabled)get('[role=status]').textContent='Earn '+(selected.price-state.coins)+' more coins for '+selected.name+'.';
  }
  get('.shop-action').onclick=async()=>{
   if(busy||!profile)return;
   filter.disabled=true;
   busy=true;dialog.querySelectorAll('button').forEach(b=>b.disabled=true);
   const item=selected,state=read(),action=(state.equipped||[]).includes(item.id)&&(draft===null||draft===(state.colours?.[item.id]||'original'))?'remove':state.inventory.includes(item.id)?'wear':'buy';
   const apply=async()=>{
    const key=api.key(profile),previous=storage.getItem(key);
    if(rewardId){
     const claim=api.chooseAvatarReward(storage,profile,rewardId,item.id);
     if(claim.alreadyClaimed)throw Error('This reward has already been claimed.');
    }
    api.shopChange(storage,profile,item.id,rewardId?'wear':action,draft??state.colours?.[item.id]??'original');
    if(profile.cloud&&!await root.SpellmasterCloud.save()){
     if(previous===null)storage.removeItem(key);else storage.setItem(key,previous);
     throw Error('Please reopen Spellmaster to reconnect your account and check your wardrobe.');
    }
   };
   try{
    if(navigator.locks)await navigator.locks.request(api.key(profile),apply);else await apply();
    if(rewardId){rewardId=null;setFilters();get('h2').textContent='Explorer shop'}
    root.dispatchEvent(new Event('explorer-changed'));trying=false;draft=null;get('[role=status]').textContent=action==='remove'?item.name+' taken off.':'Your explorer is wearing '+item.name+'.';
   }catch(e){get('[role=status]').textContent=e.message}
   finally{busy=false;filter.disabled=false;get('.shop-close').disabled=false;paint()}
  };
  get('.shop-close').onclick=()=>dialog.close();
  dialog.oncancel=e=>{if(busy)e.preventDefault()};
  dialog.onclose=()=>{dialog.remove();afterClose()};
  if(rewardId)get('h2').textContent='Choose your free reward';
  paint();dialog.showModal();
 }
 root.ExplorerShop={open};
})(window);
