'use strict';
/**
 * Subscription and access rules: policy-only (no payments, accounts, databases or authentication).
 * Enforcement belongs on an authenticated server with tenant-scoped queries.
 */
const PLANS=Object.freeze({
 personal:Object.freeze({id:'personal',amountGbp:10,interval:'year',pupilLimit:1,schoolAccess:false}),
 school_30:Object.freeze({id:'school_30',amountGbp:50,interval:'year',pupilLimit:30,schoolAccess:true}),
 school_unlimited:Object.freeze({id:'school_unlimited',amountGbp:100,interval:'year',pupilLimit:null,schoolAccess:true})
});
const VALID_ROLES=new Set(['school_admin','teacher','guardian','individual','learner']);
function plan(id){const p=PLANS[id];if(!p)throw Error('Unknown membership plan');return p}
function isActiveSubscription(sub,asOf=new Date().toISOString()){
 if(!sub||!['active','trialing'].includes(sub.status))return false;
 if(typeof sub.validUntil!=='string'||Number.isNaN(Date.parse(sub.validUntil)))return false;
 return Date.parse(sub.validUntil)>Date.parse(asOf);
}
function canAddLearner({planId,activeLearners,subscription,asOf}={}){
 const p=plan(planId);
 if(!isActiveSubscription(subscription,asOf))return {allowed:false,reason:'subscription_inactive'};
 if(!Number.isInteger(activeLearners)||activeLearners<0)return {allowed:false,reason:'invalid_count'};
 if(p.pupilLimit!==null&&activeLearners>=p.pupilLimit)return {allowed:false,reason:'seat_limit'};
 return {allowed:true,reason:null};
}
function canViewLearner({actor,target,assignedClassIds=[]}={}){
 if(!actor||!target||!VALID_ROLES.has(actor.role))return false;
 if(actor.role==='learner')return actor.learnerId===target.learnerId;
 // School membership never leaks pupil data between tenants.
 if(actor.role==='school_admin')return Boolean(actor.schoolId&&target.schoolId===actor.schoolId);
 if(actor.role==='teacher')return Boolean(actor.schoolId&&target.schoolId===actor.schoolId&&
  target.classIds?.some(c=>assignedClassIds.includes(c)));
 if(actor.role==='guardian')return Boolean(target.guardianAccountIds?.includes(actor.accountId));
 if(actor.role==='individual')return Boolean(actor.learnerId&&actor.learnerId===target.learnerId);
 return false;
}
function canManageSchool({actor,schoolId}={}){
 return Boolean(actor&&actor.role==='school_admin'&&actor.schoolId===schoolId);
}
module.exports={PLANS,plan,isActiveSubscription,canAddLearner,canViewLearner,canManageSchool};
