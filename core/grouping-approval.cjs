'use strict';
/* Approved visual-grouping gate. No phoneme or syllable data in this contract.
 * Source proposals are NOT approvals; allow only explicit specialist signoff.
 */
function resolve(record,source){
 if(!record||!source||!Array.isArray(source.entries))return null;
 const item=source.entries.find(x=>x&&x.id===record.id&&x.spelling===record.word);
 if(!item||item.status!=='approved'||item.reviewer_role!=='qualified_literacy_specialist'||
    typeof item.reviewer_ref!=='string'||!item.reviewer_ref.trim()||
    typeof item.reviewed_at!=='string'||!/^\\d{4}-\\d{2}-\\d{2}/.test(item.reviewed_at)||
    !Array.isArray(item.visual_units)||item.visual_units.length<1||item.visual_units.length>5||
    item.visual_units.some(x=>typeof x!=='string'||!x.length)||
    item.visual_units.join('')!==record.word)return null;
 return item.visual_units.slice();
}
module.exports={resolve};
