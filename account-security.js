'use strict';
const crypto=require('node:crypto');
const safeHash=text=>crypto.createHash('sha256').update(text).digest('hex');
const recoveryCode=()=>crypto.randomBytes(24).toString('base64url');
function safeCompareHex(a,b){
 if(typeof a!=='string'||typeof b!=='string'||!(/^[a-f0-9]{64}$/.test(a))||!(/^[a-f0-9]{64}$/.test(b)))return false;
 return crypto.timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
}
function normaliseCode(value){return typeof value==='string'&&/^[a-zA-Z0-9_-]{32}$/.test(value)?value:null}
const attempts=new Map();
function allowAttempt(bucket,limit=6,windowMs=15*60*1000){
 const now=Date.now();const record=attempts.get(bucket)||{start:now,n:0};
 if(now-record.start>=windowMs){record.start=now;record.n=0;}
 record.n++;attempts.set(bucket,record);
 if(attempts.size>10000){for(const [key,val] of attempts)if(now-val.start>windowMs)attempts.delete(key);if(attempts.size>10000)attempts.clear();}
 return record.n<=limit;
}
module.exports={safeHash,recoveryCode,safeCompareHex,normaliseCode,allowAttempt};
