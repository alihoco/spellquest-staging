'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const page=fs.readFileSync(__dirname+'/year6.html','utf8');
const css=fs.readFileSync(__dirname+'/spellmaster-library.css','utf8');
const hud=fs.readFileSync(__dirname+'/spellmaster-library.js','utf8');
const back=fs.readFileSync(__dirname+'/assets/spellmaster/magical-library.svg','utf8');
const guide=fs.readFileSync(__dirname+'/assets/spellmaster/explorer-guide.svg','utf8');
for(const source of page.split('<script>').slice(1).map(s=>s.split('</script>')[0]))new Function(source);
new Function(hud);
assert.ok(page.includes('/spellmaster-library.css?v=6'));
assert.ok(page.includes('/spellmaster-library.js?v=5'));
for(const t of ['function reviewAudio()','function shortReview()','function retry()','function startBonusRound(plan)','function finishBonusRound()','function showAvatarRewardChoice('])
 assert.ok(page.includes(t),'Original teaching flow missing: '+t);
for(const t of ['max-width:1120px','max-width:780px','max-width:420px','.sm-layout','.sm-side-box','.sm-path','.sm-avatar-card'])
 assert.ok(css.includes(t),'Missing responsive styling: '+t);
for(const t of ['new MutationObserver','app.before(layout)','layout.append(character,app,side)','sm-journey-list','sm-coin-count','sm-point-count','sm-item-count'])
 assert.ok(hud.includes(t),'Missing HUD: '+t);
assert.ok(back.startsWith('<svg')&&guide.startsWith('<svg'));
assert.ok(!hud.includes('spellmaster-error-'), 'Visual HUD must not generate teaching hints');
assert.ok(!hud.includes('function check('),'Visual HUD must not override spelling checks');
assert.ok(page.includes('family=Fredoka:wght@400;500;600;700'), 'Fredoka web font missing');
assert.ok(page.includes('family=Nunito:wght@400;500;600;700;800;900'), 'Nunito web font missing');
for(const token of ['--font-display:','--font-body:','--fs-hero:','--fs-heading:',
 '--fs-card:','--fs-body:','--fs-helper:','--fs-button:',
 '--fs-primary-button:','--fs-chunk:','--fs-input:','--fs-feedback:'])
 assert.ok(css.includes(token), 'Missing typography token '+token);
for(const responsive of ['max-width: 1023px','max-width: 600px'])
 assert.ok(css.includes(responsive), 'Missing responsive font breakpoint '+responsive);
assert.ok(css.includes('#app .spelling-row span') && css.includes('font-weight:800!important'),
 'Spelling words must use legible Nunito ExtraBold');
assert.ok(css.includes('#app input#answer') && css.includes('#app input#bonus-answer'),
 'Independent spelling input font must remain clear');
assert.ok(css.includes('font-family:var(--font-display)!important'),
 'Headings and button styles require Fredoka');
console.log('Magical-library shell and Fredoka/Nunito responsive typography checks pass; teaching retained.');
