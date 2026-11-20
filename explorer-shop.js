(function(root){
 'use strict';
 function open(profile,storage,afterClose){
  const api=root.SpellmasterBonus;
  const dialog=document.createElement('dialog');dialog.className='explorer-studio explorer-shop';
  dialog.setAttribute('aria-label','Explorer shop');
  dialog.innerHTML='<header class="shop-head"><h2>Explorer shop</h2><p class="shop-balance"></p><button class="shop-close">Close</button></header><div class="shop-layout"><section class="shop-fitting"><div class="explorer-stage"></div><h3 class="shop-selection"></h3></section><div class="shop-stock"><div class="shop-items"></div><fieldset class="shop-colours"><legend>Item colour</legend></fieldset><button class="shop-action"></button><p role="status"></p></div></div>';
  document.body.append(dialog);
  const get=s=>dialog.querySelector(s);
  let selected=api.AVATAR_ITEMS[0],busy=false,trying=true,draft=null;
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
   get('.shop-balance').textContent=profile?'Your balance · '+state.coins+' coins':'Preview the items. Earn coins in spelling bonus rounds.';
   get('.shop-items').replaceChildren();
   for(const item of api.AVATAR_ITEMS){
    const b=document.createElement('button');b.textContent=item.name;
    const art=document.createElement('span');art.className='shop-sample';art.setAttribute('aria-hidden','true');
    art.style.backgroundPositionX=(api.AVATAR_ITEMS.indexOf(item)*100/6)+'%';b.prepend(art);
    const price=document.createElement('small');price.textContent=worn.includes(item.id)?'Wearing':state.inventory.includes(item.id)?'Owned':item.price+' coins';b.append(price);
    b.setAttribute('aria-pressed',String(item===selected));b.onclick=()=>{selected=item;draft=null;trying=true;get('[role=status]').textContent='';paint();get('.shop-items [aria-pressed=true]').focus()};get('.shop-items').append(b);
   }
   const action=get('.shop-action');
   action.textContent=worn.includes(selected.id)?(colour!==saved?'Save colour':'Take off '+selected.name):owned?'Wear '+selected.name:'Buy and wear · '+selected.price+' coins';
   action.disabled=!profile||(!owned&&state.coins<selected.price);
   if(profile&&!owned&&action.disabled)get('[role=status]').textContent='Earn '+(selected.price-state.coins)+' more coins for '+selected.name+'.';
  }
  get('.shop-action').onclick=async()=>{
   if(busy||!profile)return;
   busy=true;dialog.querySelectorAll('button').forEach(b=>b.disabled=true);
   const item=selected,state=read(),action=(state.equipped||[]).includes(item.id)&&(draft===null||draft===(state.colours?.[item.id]||'original'))?'remove':state.inventory.includes(item.id)?'wear':'buy';
   const apply=async()=>{
    const key=api.key(profile),previous=storage.getItem(key);
    api.shopChange(storage,profile,item.id,action,draft??state.colours?.[item.id]??'original');
    if(profile.cloud&&!await root.SpellmasterCloud.save()){
     if(previous===null)storage.removeItem(key);else storage.setItem(key,previous);
     throw Error('Please reopen Spellmaster to reconnect your account and check your wardrobe.');
    }
   };
   try{
    if(navigator.locks)await navigator.locks.request(api.key(profile),apply);else await apply();
    trying=false;draft=null;get('[role=status]').textContent=action==='remove'?item.name+' taken off.':'Your explorer is wearing '+item.name+'.';
   }catch(e){get('[role=status]').textContent=e.message}
   finally{busy=false;get('.shop-close').disabled=false;paint()}
  };
  get('.shop-close').onclick=()=>dialog.close();
  dialog.oncancel=e=>{if(busy)e.preventDefault()};
  dialog.onclose=()=>{dialog.remove();afterClose()};
  paint();dialog.showModal();
 }
 root.ExplorerShop={open};
})(window);
