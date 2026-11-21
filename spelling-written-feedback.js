/* Spellmaster targeted written-spelling feedback.
 * Gives reliable letter-level observations, NOT automated phoneme or diagnosis claims.
 * Never invents a rule; word-specific reviewed linguistic explanations stay separate.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterWrittenFeedback=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
function analyse(word,attempt){
 const target=String(word||'').toLowerCase(),typed=String(attempt||'').toLowerCase();
 if(!/^[a-z]+(?:'[a-z]+)?$/.test(target)||!/^[a-z']*$/.test(typed)||typed.length>60)return {kind:'unclassified'};
 if(typed===target)return {kind:'correct',target};
 const n=target.length,m=typed.length;
 const d=Array.from({length:n+1},()=>Array(m+1).fill(0));
 for(let i=0;i<=n;i++)d[i][0]=i;
 for(let j=0;j<=m;j++)d[0][j]=j;
 for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){
  d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(target[i-1]===typed[j-1]?0:1));
 }
 let i=n,j=m;
 const differences=[];
 while(i||j){
  if(i&&j&&target[i-1]===typed[j-1]&&d[i][j]===d[i-1][j-1]){i--;j--;continue;}
  if(i&&j&&d[i][j]===d[i-1][j-1]+1){differences.push({kind:'different_letter',expected:target[i-1],position:i-1});i--;j--;continue;}
  if(i&&d[i][j]===d[i-1][j]+1){differences.push({kind:'missing_letter',expected:target[i-1],position:i-1});i--;continue;}
  if(j&&d[i][j]===d[i][j-1]+1){differences.push({kind:'extra_letter',position:i});j--;continue;}
  break;
 }
 differences.reverse();
 return {kind:differences.length===1?differences[0].kind:'several_differences',
  differences,distance:d[n][m],target};
}
function lesson(word,attempt,visualGroups){
 const a=analyse(word,attempt),parts=Array.isArray(visualGroups)&&visualGroups.join('')===word?visualGroups:[word];
 if(a.kind==='correct')return {kind:'correct',text:'You remembered that spelling.',spoken:'You remembered that spelling.'};
 const safeWord=String(word).replace(/[^a-z']/gi,'');
 const written=parts.length>1?parts.join(' | '):safeWord;
 let specific='';
 if(a.differences?.length===1){
  const x=a.differences[0],position=x.position+1;
  if(x.kind==='missing_letter')specific='One letter was missing: the letter '+x.expected.toUpperCase()+' at position '+position+'. ';
  if(x.kind==='different_letter')specific='The spelling uses the letter '+x.expected.toUpperCase()+' at position '+position+'. ';
  if(x.kind==='extra_letter')specific='There was an extra letter in your attempt. ';
 }
 if(word==='different'&&!String(attempt).toLowerCase().includes('ff'))specific='Different has two F letters together. Look for that pair near the beginning. ';
 if(!specific)specific='A few letters need another look. ';
 const text=specific+'Look at the written groups. Then hide the word and try again.';
 const spoken=specific+'Look at how the word is written. When you are ready, hide it and try again.';
 return {kind:a.kind,text,spoken,expectedWord:safeWord,groups:parts.slice(),helpLevel:'supported_written_comparison',safeLinguisticClaims:true};
}
return {analyse,lesson};
});
