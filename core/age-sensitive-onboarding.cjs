'use strict';
// Age informs appearance and INITIAL diagnostic entry only. It never restricts progression.
// Birth month (YYYY-MM) is deliberately less identifying than a full date of birth.
function birthMonthParts(value){
 if(typeof value!=='string'||!/^(19|20)\d{2}-(0[1-9]|1[0-2])$/.test(value))throw Error('Birth month must be YYYY-MM');
 const [year,month]=value.split('-').map(Number);return {year,month};
}
function approximateAge(birthMonth,asOf='2026-11-12'){
 const {year,month}=birthMonthParts(birthMonth);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf)||!Number.isFinite(Date.parse(asOf+'T12:00:00Z')))throw Error('Invalid current date');
 const [y,m]=asOf.split('-').map(Number);
 const elapsed=(y-year)*12+m-month;
 if(elapsed<0)throw Error('Birth month is in the future');
 if(elapsed>1200)throw Error('Birth month outside plausible range');
 return {approximateYears:Math.floor(elapsed/12),elapsedMonths:elapsed,precision:'month_year_only'};
}
function onboardingRecommendation({birthMonth,asOf='2026-11-12',themeOverride=null,startingBandOverride=null}={}){
 const age=approximateAge(birthMonth,asOf).approximateYears;
 const suggestion=age<=5?['playful','foundation']:
 age<=7?['young_adventure','year1_2']:
 age<=9?['discovery','year2_3']:
 age<=10?['quest','year3_4']:
 age<=12?['explorer','year5_6']:
 age<=16?['modern_adventure','secondary_foundations']:
 ['minimal','adult_diagnostic'];
 return {ageApproximateYears:age,theme:themeOverride||suggestion[0],
  initialAssessmentBand:startingBandOverride||suggestion[1],
  startWithShortAudioLedSample:true,assessmentChangesImmediatelyWithObservedAccuracy:true,
  progressionCap:null,appearanceIndependentOfSpellingLevel:true,
  approximateSchoolYearNotInferred:true,themeOverrideAllowed:true};
}
function assessmentNext({currentBand,independentAttempts=[],availableBands=['foundation','year1_2','year2_3','year3_4','year5_6','secondary_foundations','adult_diagnostic'],minimumEvidence=3}={}){
 const i=availableBands.indexOf(currentBand);if(i<0)throw Error('Unknown assessment band');
 const attempts=independentAttempts.filter(x=>x.shownTargetLetters!==true&&x.usedHints!==true&&typeof x.correct==='boolean');
 if(attempts.length<minimumEvidence)return {action:'collect_more_evidence',band:currentBand};
 const last=attempts.slice(-minimumEvidence),correct=last.filter(x=>x.correct).length;
 if(correct===minimumEvidence&&i<availableBands.length-1)return {action:'sample_harder',band:availableBands[i+1]};
 if(correct===0&&i>0)return {action:'sample_easier',band:availableBands[i-1]};
 return {action:'teach_and_review',band:currentBand};
}
module.exports={birthMonthParts,approximateAge,onboardingRecommendation,assessmentNext};
