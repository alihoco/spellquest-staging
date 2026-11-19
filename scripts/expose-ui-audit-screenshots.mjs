import fs from 'node:fs/promises';
const token=process.env.GITHUB_TOKEN,repo=process.env.GITHUB_REPOSITORY;
if(!token||!repo)throw Error('GitHub action token required');
for(const name of ['01-assessment-welcome-mobile','02-assessment-question-mobile','04-adventure-entry-mobile','06-first-spelling-question-mobile','07-supported-review-mobile','10-family-signup-mobile']){
 const buf=await fs.readFile('child-journey-audit/'+name+'.jpg');
 const response=await fetch('https://api.github.com/repos/'+repo+'/git/blobs',{
  method:'POST',headers:{Authorization:'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},
  body:JSON.stringify({content:buf.toString('base64'),encoding:'utf-8'})
 });
 const b=await response.json();
 if(!response.ok)throw Error('Could not create temporary visual audit blob '+name+': '+response.status);
 console.log('SPELLMASTER_ASCII_JPEG_BLOB '+name+' '+b.sha+' '+buf.length);
}
