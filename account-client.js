/* Spellmaster account client. Session token is tab-scoped; never localStorage. */
(function(root){
 'use strict';
 const base='https://spellquest-voice-staging.onrender.com/api/account';
 const sessionKey='spellmaster-session-v1',learnerKey='spellmaster-learner-v1';
 function token(){return sessionStorage.getItem(sessionKey);}
 function selectedLearner(){return sessionStorage.getItem(learnerKey);}
 function setAuth(result){if(!result?.token||!result?.learner?.id&&!result?.account)throw Error('Invalid account response');sessionStorage.setItem(sessionKey,result.token);if(result.learner?.id)sessionStorage.setItem(learnerKey,result.learner.id);}
 function selectLearner(id){if(!/^[\da-f-]{36}$/i.test(id))throw Error('Invalid learner');sessionStorage.setItem(learnerKey,id);}
 function signOut(){
  const old=token();
  let profile=null;try{profile=JSON.parse(sessionStorage.getItem('spellmaster-cloud-active-v1')||'null')}catch{}
  if(profile?.id&&/^lp-[a-z0-9]+$/.test(profile.id)){
   for(const prefix of ['spellmaster-staging-intake-v1:','spellmaster-placement-v1:','spellmaster-bonus-v1:','spellmaster-local-splitter-v1:','spellmaster-welcome-heard-v1:','spellmaster-splitter-introduction-v1:'])sessionStorage.removeItem(prefix+profile.id);
  }
  sessionStorage.removeItem('spellmaster-cloud-active-v1');
  sessionStorage.removeItem(sessionKey);
  sessionStorage.removeItem(learnerKey);
  if(old)fetch(base+'/logout',{method:'POST',headers:{Authorization:'Bearer '+old},mode:'cors'}).catch(()=>{});
 }
 async function request(path,{method='GET',body,authenticated=true}={}){
  const headers={'Accept':'application/json'};
  if(body!==undefined)headers['Content-Type']='application/json';
  if(authenticated){if(!token())throw Error('Please sign in to save your progress.');headers.Authorization='Bearer '+token();}
  let res;try{res=await fetch(base+path,{method,headers,mode:'cors',cache:'no-store',body:body===undefined?undefined:JSON.stringify(body)});}catch{throw Error('The secure account service is unavailable. Please try again.');}
  let result;try{result=await res.json()}catch{throw Error('The account service returned an unexpected response.');}
  if(!res.ok)throw Error(result.error||'Your request could not be completed.');
  return result;
 }
 async function register(data){const result=await request('/register',{method:'POST',body:data,authenticated:false});setAuth(result);return result;}
 async function login(username,password){const result=await request('/login',{method:'POST',body:{username,password},authenticated:false});setAuth(result);const me=await request('/me');if(me.learners?.length)selectLearner(me.learners[0].id);return me;}
 async function saveEvent(type,payload,learnerId=selectedLearner()){if(!learnerId)throw Error('Choose a learner first');return request('/learners/'+encodeURIComponent(learnerId)+'/events',{method:'POST',body:{type,payload}});}
 async function loadState(learnerId=selectedLearner()){return request('/learners/'+encodeURIComponent(learnerId)+'/state');}
 async function saveState(state,learnerId=selectedLearner()){return request('/learners/'+encodeURIComponent(learnerId)+'/state',{method:'PATCH',body:{state}});}
 root.SpellmasterAccount={register,login,request,token,selectedLearner,selectLearner,signOut,saveEvent,loadState,saveState,configured:()=>request('/status',{authenticated:false}).then(x=>!!x.available).catch(()=>false)};
})(typeof window!=='undefined'?window:globalThis);
