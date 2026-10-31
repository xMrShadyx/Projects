import {safeName} from './model.mjs';
// Outputs keep snapshots of their inputs; producing or removing an output never
// renames, removes or attaches a result to an original file.
export function makeResult(sources,blob,settings,{id=crypto.randomUUID(),batchId=null}={}){
 if(!sources.length)throw Error('A result must have at least one source.');
 const format=blob.outputFormat||settings.format;
 const merged=settings.mode==='pdfTools'&&settings.pdfAction==='merge';
 return {id,batchId,blob,format,name:`${merged?'merged':safeName(sources[0].file.name)}-${id.slice(0,6)}.${format}`,sourceIds:Object.freeze(sources.map(s=>s.id)),sourceNames:Object.freeze(sources.map(s=>s.file.name)),merged,sourceFiles:Object.freeze(sources.map(s=>s.file)),sourceBytes:sources.reduce((n,s)=>n+s.file.size,0)};
}
export function overallProgress(completed,total,activePercent=0){if(total<1)return 0;return Math.min(99,Math.max(0,Math.floor((completed+Math.min(100,Math.max(0,activePercent))/100)/total*100)))}
