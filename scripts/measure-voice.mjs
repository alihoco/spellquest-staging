import fs from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {execFileSync} from 'node:child_process';
const root='https://spellquest-voice-staging.onrender.com';
const out='voice-latency-audit';
await fs.mkdir(out,{recursive:true});
const clips=[
 ['welcome','/api/voice?clip=spellmaster-adaptive-welcome-v1&voice=marin'],
 ['people','/api/voice?clip=catalogue-word-en-people-v1&voice=marin']
];
const result={date:new Date().toISOString(),notes:'Network download durations, NOT device playback/voice warmth/accent approval.',clips:[]};
for(const [name,path] of clips){
 const controller=new AbortController(),time=setTimeout(()=>controller.abort(),70000);
 const begin=performance.now();let response;
 try{
  response=await fetch(root+path,{headers:{Origin:'https://spellquest-staging.onrender.com'},signal:controller.signal});
  const receivedHeadersMs=Math.round(performance.now()-begin);
  const arr=await response.arrayBuffer();
  const downloadedMs=Math.round(performance.now()-begin);
  const entry={name,status:response.status,firstResponseMs:receivedHeadersMs,downloadedMs,bytes:arr.byteLength,contentType:response.headers.get('content-type')};
  if(response.ok&&arr.byteLength>500){
   const file=out+'/'+name+'.mp3';await fs.writeFile(file,Buffer.from(arr));
   try{entry.durationSeconds=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file],{encoding:'utf8'}).trim());}catch{entry.durationSeconds=null}
  }
  result.clips.push(entry);
 }catch(e){result.clips.push({name,error:e.message})}finally{clearTimeout(time)}
}
await fs.writeFile(out+'/metrics.json',JSON.stringify(result,null,2));
console.log('SPELLMASTER_REAL_VOICE_METRICS '+JSON.stringify(result));
if(result.clips.some(x=>x.status!==200||!x.bytes))process.exitCode=1;
