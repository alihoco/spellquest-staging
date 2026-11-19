import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const origin='https://spellquest-staging.onrender.com';
const notes=[],screenshots=[],errors=[],started=Date.now();
const out='child-journey-audit';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const data={date:new Date().toISOString(),persona:'simulated nine-year-old struggling with literacy (NOT an actual learner study)',
  methodology:'Chromium browser DOM and interaction journey, with narration requests blocked for deterministic timing. Does not verify pronunciation quality or real audio pauses.',
  screens:[],errors,assessment:[],game:{},narration:{}};
async function capture(page,name){
 const file=path.join(out,name+'.png');
 await page.screenshot({path:file,fullPage:true});
 await page.screenshot({path:path.join(out,name+'.jpg'),type:'jpeg',quality:55,fullPage:true});
 screenshots.push(file);
 const size=await page.evaluate(()=>{
  const buttons=[...document.querySelectorAll('button,a.btn,.spellmaster-speaker')].filter(x=>x.getBoundingClientRect().height>0);
  const descriptions=buttons.map(x=>({text:(x.getAttribute('aria-label')||x.textContent||'').trim().slice(0,75),
   width:Math.round(x.getBoundingClientRect().width),height:Math.round(x.getBoundingClientRect().height),
   top:Math.round(x.getBoundingClientRect().top)}));
  return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,
   interactive:descriptions.slice(0,35),smallTouchTargets:descriptions.filter(b=>b.width<40||b.height<40).slice(0,14),
   mainTextLength:(document.querySelector('main')?.innerText||'').length,
   speakerIcons:document.querySelectorAll('.spellmaster-speaker').length};
 });
 data.screens.push({name,...size});return size;
}
function track(page){page.on('pageerror',e=>errors.push(String(e).slice(0,450)));page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text().slice(0,250))});}
try{
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
 track(page);
 await page.route('https://spellquest-voice-staging.onrender.com/api/voice*',route=>route.abort('failed'));
 await page.route('https://spellquest-voice-staging.onrender.com/api/read-aloud*',route=>route.abort('failed'));
 await page.goto(origin+'/starting-assessment.html',{waitUntil:'domcontentloaded',timeout:45000});
 await capture(page,'01-assessment-welcome-mobile');
 data.assessment.push({step:'welcome',text:await page.locator('#welcome').innerText()});
 await page.locator('#welcome > button').click();
 await capture(page,'02-assessment-question-mobile');
 const inputs=['sed','come','nite','becos','enuf','faverit','nesesary','enviroment','rithm','acomodate'];
 for(let i=0;i<inputs.length;i++){
  const actual=await page.evaluate(()=>typeof current==='object'&&current?current.word:null);
  await page.locator('#answer').fill(inputs[i]);
  const visible=await page.locator('#count').innerText();
  data.assessment.push({number:i+1,display:visible,wordUsed:actual,entered:inputs[i],spellcheck:await page.locator('#answer').getAttribute('spellcheck')});
  await page.locator('#quiz .actions button').first().click();
 }
 await page.waitForSelector('#done:not(.hidden)',{timeout:8000});
 data.assessment.push({step:'complete',text:await page.locator('#done').innerText()});
 await capture(page,'03-assessment-result-mobile');
 data.assessment.push({closingText:await page.locator('#assessment-session-close').innerText(),
   replayAvailable:await page.getByRole('button',{name:/Hear your goodbye/}).isVisible()});
 if(!/Better today than yesterday/i.test(await page.locator('#assessment-session-close').innerText()))throw Error('Assessment closing missing motto');
 const guestAssessment=await page.evaluate(()=>localStorage.getItem('spellmaster-starting-assessment-v1:guest'));
 data.assessment.push({guestSavedToBrowser:!!guestAssessment,answerCount:JSON.parse(guestAssessment||'{}').responses?.length||0});
 await page.goto(origin+'/year6.html',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForTimeout(1500);
 await capture(page,'04-adventure-entry-mobile');
 data.game.brandPromiseVisible=await page.locator('.brand-promise').isVisible();
 data.game.brandPromiseText=await page.locator('.brand-promise').innerText();
 if(!data.game.brandPromiseVisible||!/Better today[\s\S]*than yesterday/i.test(data.game.brandPromiseText))throw Error('Brand promise not visible on entry screen');
 data.game.guestProfileTop=await page.locator('#new-alias').evaluate(el=>Math.round(el.getBoundingClientRect().top)).catch(()=>null);
 const name=page.locator('#new-alias');
 if(await name.count()){
  await name.fill('Star Explorer');
  await page.locator('#new-age').selectOption('9');
  await page.getByRole('button',{name:/Start my adventure/}).click();
  await page.waitForTimeout(600);
  await capture(page,'05-adventure-age-nine-home-mobile');
  data.game.chapterOrder=await page.evaluate(()=>{
    const chapter=document.querySelector('#app .next-chapter');
    const sprint=document.querySelector('#app .sprint-feature');
    const primary=chapter?.querySelector('button.quick-play');
    const extras=document.querySelector('.sm-side');
    return {chapterBeforeSprint:!!(chapter&&sprint&&(chapter.compareDocumentPosition(sprint)&Node.DOCUMENT_POSITION_FOLLOWING)),
      startInsideChapter:!!primary,oldProgressHidden:!!extras&&getComputedStyle(extras).display==='none',
      primaryText:primary?.innerText, sprintExplanation:(sprint?.innerText||'').trim().slice(0,450)};
  });
  if(!data.game.chapterOrder.chapterBeforeSprint||!data.game.chapterOrder.startInsideChapter||
     !data.game.chapterOrder.oldProgressHidden)throw Error('Simple returning dashboard or chapter start is wrong');
  data.game.quickStartTop=await page.locator('#app button.quick-play').evaluate(el=>Math.round(el.getBoundingClientRect().top)).catch(()=>null);
  data.game.transferredGuestBaseline=await page.evaluate(()=>{const p=SpellmasterProfiles.active(localStorage);const r=localStorage.getItem('spellmaster-starting-assessment-v1:'+p?.id);return r?JSON.parse(r).transferredFromGuest===true:false});
  const start=page.getByRole('button',{name:/Start|Begin|Continue|Play|Adventure/}).filter({visible:true});
  data.game.startButtonTexts=await start.allTextContents();
  let clicked=false;
  for(const text of ['Continue my adventure','Start spelling','Start adventure','Begin adventure','Play my adventure']){
   const match=page.getByRole('button',{name:text,exact:false});
   if(await match.count()&&await match.first().isVisible()){await match.first().click();clicked=true;break}
  }
  if(!clicked){
   const buttons=await page.locator('#app button').allTextContents();
   data.game.noStartClickFound=buttons.slice(0,20);
   // Programmatic click through page's real start handler only if exposed and normal button can't be identified.
   if(await page.evaluate(()=>typeof window.begin==='function')){await page.evaluate(()=>window.begin());clicked=true}
  }
  data.game.started=clicked;
  if(clicked){
   await page.waitForTimeout(1200);
   if(await page.locator('#answer').count()){
    await capture(page,'06-first-spelling-question-mobile');
    data.game.wordInputPosition=await page.locator('#answer').evaluate(el=>({top:Math.round(el.getBoundingClientRect().top),bottom:Math.round(el.getBoundingClientRect().bottom)}));
    data.game.firstPrompt=(await page.locator('#app').innerText()).slice(0,950);
    await page.locator('#answer').fill('speling');
    const check=page.locator('#app button').filter({hasText:/Check my spelling|Check spelling/}).first();
    if(await check.count())await check.click();
    else await page.locator('#answer').press('Enter');
    await page.waitForTimeout(1200);
    data.game.review=(await page.locator('#app').innerText()).slice(0,1500);
    await capture(page,'07-supported-review-mobile');
    data.game.chunkCount=await page.locator('.spelling-row span').count();
    data.game.changeGroupingButtons=await page.getByRole('button',{name:/Make my own groups|Change my groups|Try splitting/}).count();
    data.game.primaryReviewAction=await page.locator('#app > .actions').last().locator('button').first().innerText();
    if(!/Hide.*try spelling/i.test(data.game.primaryReviewAction))throw Error('Primary review action should hide the answer and retry');
    await page.getByRole('button',{name:/Hide it and try spelling/}).click();
    await page.waitForSelector('#answer',{timeout:5000});
    data.game.retryInputPresent=true;
    await page.locator('#answer').fill(await page.evaluate(()=>WORDS[idx].word));
    await page.getByRole('button',{name:/Check my spelling/}).click();
    data.game.retryAccepted=true;
    await page.waitForTimeout(750);
    await page.getByRole('button',{name:/Finish for today/}).first().click({timeout:9000});
    await page.waitForSelector('.session-closing',{timeout:6000});
    data.game.closingText=await page.locator('.session-closing').innerText();
    data.game.closingReplay=await page.getByRole('button',{name:/Hear your goodbye/}).isVisible();
    await capture(page,'07b-end-of-session-mobile');
    if(!/Better today than yesterday/i.test(data.game.closingText)||!data.game.closingReplay)
      throw Error('Spelling practice must end with the motto and a replayable goodbye');
   }else{
    data.game.initialState=(await page.locator('#app').innerText()).slice(0,1100);
    await capture(page,'06-game-possible-audio-or-setup-blocker');
   }
  }
 }
 const firstTimer=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await firstTimer.goto(origin+'/year6.html',{waitUntil:'domcontentloaded'});
 await firstTimer.locator('#new-alias').fill('First Time Explorer');
 await firstTimer.locator('#new-age').selectOption('9');
 await firstTimer.getByRole('button',{name:/Start my adventure/}).click();
 await firstTimer.waitForURL('**/starting-assessment.html',{timeout:6000});
 data.game.newLearnerRoutedToAssessment=true;
 await firstTimer.close();
 const sprint=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await sprint.route('https://spellquest-voice-staging.onrender.com/api/read-aloud*',route=>route.abort('failed'));
 await sprint.goto(origin+'/spelling-sprint.html',{waitUntil:'domcontentloaded'});
 await sprint.locator('#newword').fill('apple');
 await sprint.getByRole('button',{name:/Add word/}).click();
 await sprint.getByRole('button',{name:/Practise these words/}).click();
 await sprint.locator('#answer').fill('apple');
 await sprint.getByRole('button',{name:/Check my spelling/}).click();
 await sprint.getByRole('button',{name:/Next word/}).click();
 await sprint.waitForSelector('#finished:not(.hidden)');
 data.game.sprintClosingText=await sprint.locator('#sprint-session-close').innerText();
 await capture(sprint,'07c-sprint-goodbye-mobile');
 if(!/Better today than yesterday/i.test(data.game.sprintClosingText))
   throw Error('Spelling Sprint must end with personal growth message');
 await sprint.close();
 const desktop=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 track(desktop);
 await desktop.route('https://spellquest-voice-staging.onrender.com/api/voice*',route=>route.abort('failed'));
 await desktop.goto(origin+'/starting-assessment.html',{waitUntil:'domcontentloaded'});
 await capture(desktop,'08-assessment-welcome-desktop');

 await desktop.goto(origin+'/year6.html',{waitUntil:'domcontentloaded'});
 await desktop.waitForTimeout(800);
 await desktop.evaluate(()=>{
   localStorage.setItem('spellmaster-starting-assessment-v1:guest',JSON.stringify({
    date:new Date().toISOString(),
    responses:Array.from({length:10},(_,i)=>({word:'sample'+i,band:'year1',independent:false})),
    placement:{version:2,currentBand:'year2',baselineBand:'year2',source:'adaptive_10_word_assessment_provisional'}
   }));
 });
 await desktop.locator('#new-alias').fill('Desktop Explorer');
 await desktop.locator('#new-age').selectOption('9');
 await desktop.getByRole('button',{name:/Start my adventure/}).click();
 await desktop.waitForTimeout(350);
 await capture(desktop,'08b-guided-chapter-desktop');
 data.game.desktopStartInsideChapter=await desktop.locator('#app .next-chapter button.quick-play').isVisible();
 if(!data.game.desktopStartInsideChapter)throw Error('Desktop chapter start button is not visible');
 await desktop.goto(origin+'/family-signup.html',{waitUntil:'domcontentloaded'});
 await desktop.waitForTimeout(600);
 await capture(desktop,'09-family-signup-desktop');
 await page.goto(origin+'/family-signup.html',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(600);
 await capture(page,'10-family-signup-mobile');
 await page.locator('#alias').fill('Young Explorer');
 await page.locator('#age').selectOption('9');
 await page.locator('#family-next').click();
 await capture(page,'11-family-adult-step-mobile');
 data.game.familyStep2Visible=await page.locator('#family-step2').isVisible();
 if(data.game.wordInputPosition&&data.game.wordInputPosition.top>650)throw Error('Mobile spelling input still appears too far below the fold');
 if(data.game.guestProfileTop!==null&&data.game.guestProfileTop>800)throw Error('Guest profile creation still requires excessive scrolling');
 if(data.game.quickStartTop!==null&&data.game.quickStartTop>750)throw Error('First Play control is too low on mobile');
 if(!data.game.transferredGuestBaseline)throw Error('Guest diagnostic did not transfer to the new local profile');
 if(!data.game.familyStep2Visible)throw Error('Adult family signup step is not available');
 data.narration={browserRequestsMocked:true,notAudioQualityVerified:true};
}catch(e){errors.push('JOURNEY FAILURE: '+e.stack?.slice(0,1800))}
finally{await browser.close()}
data.durationMs=Date.now()-started;
await fs.writeFile(path.join(out,'audit.json'),JSON.stringify(data,null,2));
console.log('SPELLMASTER_CHILD_AUDIT_JSON_START\n'+JSON.stringify(data,null,2)+'\nSPELLMASTER_CHILD_AUDIT_JSON_END');
if(errors.some(x=>x.startsWith('JOURNEY FAILURE')))process.exitCode=1;
