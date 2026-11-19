/* Bridge existing learning game to private server state, for signed-in learners.
 * No cloud profile or sensitive information is cached in localStorage.
 */
(function(root){
 'use strict';
 const A=root.SpellmasterAccount;
 let profile=null,revision=0,ready=false,queue=Promise.resolve(),problem='';
 const learnerKey=()=>profile?.id;
 function storage(){return root.sessionStorage;}
 async function initialize(){
  if(!A?.token()||!A.selectedLearner())return false;
  try{
   const me=await A.request('/me');
   const cloud=me.learners.find(p=>p.id===A.selectedLearner());
   if(!cloud)throw Error('Your learner profile was not found.');
   const id='lp-'+cloud.id.replace(/-/g,'').toLowerCase();
   profile={id,cloud:true,cloudId:cloud.id,alias:cloud.alias,birth:cloud.birthMonth||null,ageYears:Number.isInteger(cloud.ageYears)?cloud.ageYears:null,avatar:cloud.avatar,theme:cloud.theme||'auto',schoolYear:null};
   const state=await A.loadState(cloud.id);revision=state.version||0;
   storage().setItem('spellmaster-cloud-active-v1',JSON.stringify(profile));
   const data=state.state||{};
   if(data.history&&typeof data.history==='object'&&!Array.isArray(data.history))storage().setItem('spellmaster-staging-intake-v1:'+id,JSON.stringify(data.history));
   if(data.placement&&typeof data.placement==='object')storage().setItem('spellmaster-placement-v1:'+id,JSON.stringify(data.placement));
   if(data.bonus&&typeof data.bonus==='object')storage().setItem('spellmaster-bonus-v1:'+id,JSON.stringify(data.bonus));
   if(data.splitter&&typeof data.splitter==='object')storage().setItem('spellmaster-local-splitter-v1:'+id,JSON.stringify(data.splitter));
   ready=true;problem='';return true;
  }catch(e){problem=e.message;ready=false;storage().removeItem('spellmaster-cloud-active-v1');return false;}
 }
 function read(key){try{return JSON.parse(storage().getItem(key)||'null')}catch{return null}}
 function snapshot(){
  if(!profile||!ready)return null;
  const id=profile.id;
  return {history:read('spellmaster-staging-intake-v1:'+id)||{},placement:read('spellmaster-placement-v1:'+id)||{},bonus:read('spellmaster-bonus-v1:'+id)||{},splitter:read('spellmaster-local-splitter-v1:'+id)||{}};
 }
 function save(){
  if(!ready||!A?.token())return Promise.resolve(false);
  queue=queue.then(async()=>{
   const data=snapshot();
   if(!data)return false;
   const response=await A.request('/learners/'+profile.cloudId+'/state',{method:'PATCH',body:{state:data,expectedVersion:revision}});
   revision=response.version;
   problem='';return true;
  }).catch(e=>{problem=e.message;ready=false;console.warn('Cloud progress save paused. Return to My account and reload to protect your progress.');return false;});
  return queue;
 }
 function current(){return profile;}
 function status(){return {ready,problem,revision};}
 root.SpellmasterCloud={initialize,save,current,status};
})(window);