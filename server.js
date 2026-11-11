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

// Curated spelling-parts instruction: the displayed chunks are LETTER GROUPS, not
// a promise that every chunk corresponds to one spoken sound or syllable.
const Y6_PARTS={
 necessary:['ne','ces','sa','ry'],embarrass:['em','bar','rass'],
 accommodate:['ac','com','mo','date'],government:['gov','ern','ment'],
 foreign:['for','eign'],familiar:['fa','mil','iar'],
 environment:['en','viron','ment'],privilege:['priv','i','lege'],
 rhythm:['rhyth','m'],temperature:['tem','per','a','ture']
};
const Y6_TIPS={
 necessary:'This word has one letter C and two letters S. Think of a shirt: one collar and two sleeves.',
 embarrass:'Look for two R letters and two S letters. Those are the two pairs to remember.',
 accommodate:'Notice the two C letters and the two M letters.',
 government:'Think of the smaller word govern. Keep the letter N when you add ment.',
 foreign:'Remember the unusual ending: E I G N. It is also in the word reign.',
 familiar:'Think of family to remember the spelling at the start.',
 environment:'First remember environ, then add M E N T.',
 privilege:'The ending is L E G E, not L E D G E.',
 rhythm:'It begins R H, and it uses the letter Y. This word has an unusual spelling pattern.',
 temperature:'Remember the letter A before the final T U R E.'
};
CLIPS['y6-parts-intro']='Let us work through the spelling in small pieces. These colourful boxes are groups of letters to remember, not always separate sounds. I will read the letters in each box. Please say them with me, then press I said it to move on.';
CLIPS['y6-parts-repeat']='Your turn! Say those letters aloud, or in your head if you prefer. Then choose I said it to keep going.';
CLIPS['y6-parts-finish']='Well done practising the pieces. Now listen to our memory trick, then we will hide the spelling and give it another go.';
CLIPS['y6-hide']='Time to try again. The word is hidden. Listen to the whole word, then spell it from memory. You can replay the word whenever you need to.';
CLIPS['y6-next-instruction']='You can move to the next word, or hear this explanation again. You are in charge of the pace.';
CLIPS['y6-result-intro']='Look at your progress! These are words you tried today. The ones you worked through are opportunities to remember even more next time.';
for(const [word,parts] of Object.entries(Y6_PARTS)){
 CLIPS['y6-tip-'+word]=Y6_TIPS[word];
 for(let n=0;n<parts.length;n++){
  const letters=parts[n].toUpperCase().split('').join(', ');
  CLIPS['y6-part-'+word+'-'+n]='Here is spelling piece '+(n+1)+'. The letters are '+letters+'. Now say the letters with me: '+letters+'. Your turn.';
 }
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
 if(r.count>25||daily.count>=250)return send(res,429,{error:'Voice demo usage limit reached'},cors);
 const key=voice+':'+clip;if(cache.has(key)){res.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'public,max-age=86400',...cors});return res.end(cache.get(key))}
 daily.count++;
 try{
 const body={model:'gpt-4o-mini-tts',voice,input:CLIPS[clip],response_format:'mp3',instructions:'You are a natural, warm, calm, friendly educational narrator from England. Speak in clear neutral modern British English, with gentle human intonation, not a cartoon voice, not a computer voice, not exaggerated or patronising. Pronounce spelling words accurately and distinctly, keeping a natural pace.'};
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 let upstream;try{upstream=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal})}finally{clearTimeout(timer)}
 if(!upstream.ok){console.error('Speech API status',upstream.status);return send(res,502,{error:'Voice generation temporarily unavailable'},cors)}
 const buf=Buffer.from(await upstream.arrayBuffer());if(buf.length>2e6)return send(res,502,{error:'Voice response too large'},cors);
 if(cache.size>=80)cache.delete(cache.keys().next().value);cache.set(key,buf);
 res.writeHead(200,{'Content-Type':'audio/mpeg','Cache-Control':'public,max-age=86400',...cors});res.end(buf);
 }catch(e){console.error('Speech generation error',e.message);send(res,502,{error:'Voice generation unavailable'},cors)}
}).listen(PORT,'0.0.0.0',()=>console.log('SpellQuest voice service ready'));
