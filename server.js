'use strict';
const http=require('node:http');
const crypto=require('node:crypto');
const PORT=process.env.PORT||10000;
const ORIGIN='https://spellquest-staging.onrender.com';
const WORDS=['ship','because','necessary'];
const CLIPS={
 welcome:'Hello! Welcome to SpellQuest. Let us learn a word together.',
 discover:'Unlock the word. Look at its parts. Say them slowly and notice the tricky bit. When you are ready, press build the word.',
 build:'Build the word. Tap the chunks in the right order, then press check my word.',
 recall:'Now spell it yourself. The word is hidden. Listen carefully, remember, and type it. Press check spelling when you are ready.',
 correct:'You remembered it! Fantastic. You spelled that word all by yourself.',
 retry:'Not quite yet. That is how we learn. Look at the tricky part, then give it another go.',
 tiles:'Good try! Let us look at the chunks and try putting them in a new order.',
 restart:'Ready to try again?',
 finish:'You finished three word challenges. Great work exploring patterns and trying again.',
 ship:'ship',because:'because',necessary:'necessary',
 'y6-welcome':'Welcome to your spelling adventure. There are ten words from the Year Five and Six spelling list. Listen to each word and spell it as best you can. There are no marks or rankings. We are finding out what you already know, and what we can learn together.',
 'y6-instruction':'Listen to the word. You can press hear it again as many times as you like. Type the spelling when you are ready.',
 'y6-try':'That was a good attempt. Let us discover how this word is put together. Then you can have another go.',
 'y6-correct':'You got it! You remembered that spelling independently. Well done!',
 'y6-improved':'Look at that! You have learned something new. Every attempt helps us grow.',
 'y6-next':'Ready for the next word? You are doing brilliantly by giving these words a go.',
 'y6-finish':'You completed your spelling adventure. Look how much you practised. Your next challenge is to remember these words again another day.',
 'y6-necessary':'necessary',
 'y6-embarrass':'embarrass',
 'y6-accommodate':'accommodate',
 'y6-government':'government',
 'y6-foreign':'foreign',
 'y6-familiar':'familiar',
 'y6-environment':'environment',
 'y6-privilege':'privilege',
 'y6-rhythm':'rhythm',
 'y6-temperature':'temperature'
};

// Teaching pronunciations are approximate, deliberately clear spoken chunks.
// In irregular spellings, the highlighted printed group may not exactly match
// one spoken syllable. The full-word pronunciation and spelling rule remain primary.
const Y6_SOUND={
 necessary:['neh','sess','uh','ree'],
 embarrass:['em','bar','rass'],
 accommodate:['uh','kom','uh','dayt'],
 government:['guv','ern','ment'],
 foreign:['for','in'],
 familiar:['fuh','mill','yuh'],
 environment:['en','vy run','ment'],
 privilege:['priv','uh','lij'],
 rhythm:['rith','um'],
 temperature:['tem','pruh','uh','chuh']
};
const Y6_TIPS={
 necessary:'Listen to the word necessary. The sound can help us remember its rhythm, but we still need the spelling trick. One C and two S letters. Think of a shirt with one collar and two sleeves.',
 embarrass:'It sounds like em bar ass, but the spelling has two R letters and two S letters.',
 accommodate:'Listen to accommodate. The spelling has a double C and a double M. These pairs need special attention.',
 government:'Listen to government. Think of govern, then add ment. Keep the N.',
 foreign:'Foreign has an unusual ending. It sounds different from its letters. Remember E I G N.',
 familiar:'Familiar is related to family. This connection helps explain the spelling.',
 environment:'Think of the word environ, then add ment. The written parts help when the sounds change.',
 privilege:'The ending sounds like lij, but the spelling uses L E G E. Remember this unusual ending.',
 rhythm:'Rhythm has an unusual spelling. The first sound is written R H. The vowel sound is written with Y.',
 temperature:'Temperature is often pronounced quickly. Remember the letter A before the ending T U R E.'
};
CLIPS['y6-demo-start']='Welcome to your spelling adventure. Listen to each word and type how you think it is spelled. You can listen again whenever you like. Ready? Here is your first word.';
CLIPS['y6-demo-word']='Listen to the word. Type the spelling when you are ready.';
CLIPS['y6-demo-repeat']='Listen to the whole word and say it aloud with me.';
CLIPS['y6-demo-parts']='Now listen to the smaller spoken parts. Watch each one light up, and say it with me.';
CLIPS['y6-demo-retry']='Now the word is hidden. Listen again, and try spelling it yourself.';
CLIPS['y6-demo-done']='That was great practice. You can come back and try again another day.';
CLIPS['y6-parts-intro']='Now listen to the sounds. Watch the parts light up and say them together.';
CLIPS['y6-parts-repeat']='Your turn. Say the parts together, then try the whole word.';
CLIPS['y6-parts-finish']='Here is the spelling trick.';
CLIPS['y6-hide']='Now hide the word and try spelling it again.';
CLIPS['y6-next-instruction']='Ready for your next word?';
CLIPS['y6-result-intro']='Look at how far you have come today.';
for(const [word,sounds] of Object.entries(Y6_SOUND)){
 CLIPS['y6-tip-'+word]=Y6_TIPS[word];
 for(let n=0;n<sounds.length;n++){
  CLIPS['y6-part-'+word+'-'+n]=''+sounds[n]+'.';
 }
}

/* v0.8: Speech-first sound cues. Syllables are separated from written spelling
   groups. AI-generated clips must be reviewed by a trained educator before production. */
const SOUND_SYLLABLES={
 necessary:['ness','uh','ser','ee'],
 embarrass:['im','bar','uhs'],
 accommodate:['uh','kom','uh','dayt'],
 government:['guv','ern','ment'],
 foreign:['for','in'],
 familiar:['fuh','mil','yuh'],
 environment:['in','vy','run','ment'],
 privilege:['priv','uh','lij'],
 rhythm:['rith','um'],
 temperature:['tem','pruh','chuh']
};
CLIPS['y6-v08-welcome']='Hello, and welcome to SpellQuest! We are going to practise ten spellings together. First, I will say each word, and you can try writing it. If a word is difficult, that is absolutely fine. I will help you hear it slowly, show you its spelling patterns, and give you another go. You can replay my voice whenever you like. Ready? Let us begin.';
CLIPS['spellmaster-adaptive-welcome-v1']='Hello, and welcome to Spellmaster! We will explore some spellings together at your own pace. I will say a word, and you can try spelling it. If you already know it, we can move on. If it is tricky, I will help you understand its spelling and try again. We will also revisit older words to see what you remember. You can listen again or finish your adventure whenever you like. Ready? Let us begin.';
CLIPS['y6-v08-prompt']='Here is your word. Listen carefully, then type your spelling.';
CLIPS['y6-v08-wrong']='Good try. This is how we learn. First, listen to the whole word and say it with me. Then we will practise its spoken parts, and look at the tricky spelling.';
CLIPS['y6-v08-sounds']='Now we will say the word in smaller spoken parts. Hear each sound, then say it back. There is time after each one.';
CLIPS['y6-v08-spelling']='Now let us look at the way the word is written. The spelling parts do not always match the sounds perfectly. Here is a trick to remember the difficult letters.';
CLIPS['y6-v08-ready']='You have practised the sounds and the spelling trick. When you are ready, hide the word and try spelling it from memory.';
CLIPS['y6-v08-retry']='The spelling is hidden now. Listen to the word and type your best spelling.';
CLIPS['y6-v08-next']='Well done for practising. Let us try the next word.';
CLIPS['y6-v08-complete']='Look at all the words you have explored today. It is your progress that matters. You can come back and practise again another day.';
for(const [word,syllables] of Object.entries(SOUND_SYLLABLES)){
 for(let j=0;j<syllables.length;j++){
  CLIPS['y6-v08-sound-'+word+'-'+j]=syllables[j];
 }
}

// Review-only whole word and explanation clips. These are NOT educator-approved
// phoneme/syllable audio and MUST NOT be served as approved spelling lessons.
const draftWordRecords=require('./core/seed-word-records-y5-6.json').records;
for(const wordRecord of draftWordRecords){
 const key='pilot-'+wordRecord.spelling;
 CLIPS[key+'-whole']=wordRecord.spelling;
 CLIPS[key+'-definition']=wordRecord.teaching.provisional_script.definition;
 CLIPS[key+'-sentence']=wordRecord.teaching.provisional_script.contextual_example;
 CLIPS[key+'-explanation']=wordRecord.teaching.provisional_script.explain;
 CLIPS[key+'-instruction']=wordRecord.teaching.provisional_script.question;
}

const cache=new Map(),limits=new Map();let daily={day:'',count:0};
function send(res,code,obj,headers={}){res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store',...headers});res.end(JSON.stringify(obj))}
http.createServer(async(req,res)=>{
 const origin=req.headers.origin||'';const cors=origin===ORIGIN?{'Access-Control-Allow-Origin':ORIGIN,'Vary':'Origin'}:{};
 if(req.method==='OPTIONS'){res.writeHead(204,{...cors,'Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type'});return res.end()}
 const url=new URL(req.url,'https://voice.local');
 if(url.pathname==='/health')return send(res,200,{ok:true,configured:!!process.env.OPENAI_API_KEY},cors);
 if(url.pathname!=='/api/voice'||req.method!=='GET')return send(res,404,{error:'Not found'},cors);
 if(origin!==ORIGIN)return send(res,403,{error:'Origin not allowed'},cors);
 const clip=url.searchParams.get('clip'),voice=url.searchParams.get('voice')||'marin';
 if(!Object.hasOwn(CLIPS,clip)||!['marin','cedar'].includes(voice))return send(res,400,{error:'Invalid clip'},cors);
 if(!process.env.OPENAI_API_KEY)return send(res,503,{error:'Voice service needs an API key'},cors);
 const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').toString().split(',')[0].trim();
 const now=Date.now(),r=limits.get(ip)||{start:now,count:0};
 if(now-r.start>60000){r.start=now;r.count=0}r.count++;limits.set(ip,r);
 const today=new Date().toISOString().slice(0,10);if(daily.day!==today)daily={day:today,count:0};
 if(r.count>80||daily.count>=250)return send(res,429,{error:'Voice demo usage limit reached'},cors);
 const key=voice+':'+clip;if(cache.has(key)){res.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'public,max-age=86400',...cors});return res.end(cache.get(key))}
 daily.count++;
 try{
 const body={model:'gpt-4o-mini-tts',voice,input:CLIPS[clip],response_format:'mp3',instructions:'You are a natural, warm, calm, friendly educational narrator from England. Speak in clear neutral modern British English, with gentle human intonation, not a cartoon voice, not a computer voice, not exaggerated or patronising. For short speech-sound clips, speak the phonetic syllable as ordinary continuous British English speech. Do not say the names of letters or explain the sound. Use natural pronunciation and do not prolong the vowel. Pronounce spelling words accurately and distinctly, keeping a natural pace.'};
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 let upstream;try{upstream=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal})}finally{clearTimeout(timer)}
 if(!upstream.ok){console.error('Speech API status',upstream.status);return send(res,502,{error:'Voice generation temporarily unavailable'},cors)}
 const buf=Buffer.from(await upstream.arrayBuffer());if(buf.length>2e6)return send(res,502,{error:'Voice response too large'},cors);
 if(cache.size>=80)cache.delete(cache.keys().next().value);cache.set(key,buf);
 res.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'public,max-age=86400',...cors});res.end(buf);
 }catch(e){console.error('Speech generation error',e.message);send(res,502,{error:'Voice generation unavailable'},cors)}
}).listen(PORT,'0.0.0.0',()=>console.log('SpellQuest voice service ready'));
