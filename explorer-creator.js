(function(root){
 'use strict';
 const valid=value=>Number.isInteger(value)&&value>=0&&value<6;
 function sprite(value){
  const el=document.createElement('span');
  el.className='personal-explorer';
  el.setAttribute('aria-hidden','true');
  el.style.setProperty('--pose-row',value*20+'%');
  return el;
 }
 function open(initial,onSave){
  let value=valid(initial)?initial:0;
  const dialog=document.createElement('dialog');
  dialog.className='explorer-studio';
  dialog.setAttribute('aria-labelledby','explorer-title');
  dialog.innerHTML='<h2 id="explorer-title">Create my explorer</h2><div class="explorer-stage"></div><fieldset><legend>Choose your explorer</legend></fieldset><fieldset><legend>Jacket colour</legend></fieldset><p role="status"></p><button type="button" class="save-explorer">Save my explorer</button> <button type="button" class="close-explorer">Close</button>';
  document.body.append(dialog);
  const preview=dialog.querySelector('.explorer-stage'),groups=dialog.querySelectorAll('fieldset');
  const sets=[['Dark curls','Auburn ponytail'],['Lagoon','Violet','Ember']];
  function render(){
   const avatar=sprite(value);avatar.classList.add('walking');preview.replaceChildren(avatar);
   groups.forEach((group,g)=>Array.from(group.querySelectorAll('button')).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===(g===0?Math.floor(value/3):value%3)))));
  }
  sets.forEach((labels,g)=>labels.forEach((label,i)=>{
   const button=document.createElement('button');button.type='button';button.textContent=label;
   button.onclick=()=>{value=g===0?i*3+value%3:Math.floor(value/3)*3+i;render()};groups[g].append(button);
  }));
  dialog.querySelector('.close-explorer').onclick=()=>dialog.close();
  dialog.onclose=()=>dialog.remove();
  dialog.querySelector('.save-explorer').onclick=async()=>{
   const controls=dialog.querySelectorAll('button');controls.forEach(b=>b.disabled=true);
   try{await onSave(value);dialog.close()}catch{dialog.querySelector('[role=status]').textContent='Your explorer could not be saved. Please try again.'}
   finally{controls.forEach(b=>b.disabled=false)}
  };
  render();dialog.showModal();
 }
 root.ExplorerCreator={valid,sprite,open};
})(window);
