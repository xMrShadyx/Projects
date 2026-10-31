import {PDFDocument,degrees} from 'pdf-lib';
export const initialPages=count=>Array.from({length:count},(_,i)=>({id:`page-${i+1}`,page:i+1,rotation:0}));
export function movePage(pages,id,beforeId){const copy=pages.map(p=>({...p})),from=copy.findIndex(p=>p.id===id);if(from<0||id===beforeId)return copy;const [item]=copy.splice(from,1),to=beforeId===null?copy.length:copy.findIndex(p=>p.id===beforeId);if(to<0)return pages.map(p=>({...p}));copy.splice(to,0,item);return copy}
export function rotatePages(pages,ids){return pages.map(p=>({...p,rotation:ids.has(p.id)?(p.rotation+90)%360:p.rotation}))}
export function removePages(pages,ids){const remaining=pages.filter(p=>!ids.has(p.id));if(!remaining.length)throw Error('Keep at least one page in your document.');return remaining.map(p=>({...p}))}
export async function savePageLayout(file,pages,{cancelled=()=>false,progress=()=>{}}={}){
 if(file.size>25*1048576)throw Error('PDF limit: 25 MB.');if(!pages.length||pages.length>200)throw Error('Keep between 1 and 200 pages.');
 const source=await PDFDocument.load(await file.arrayBuffer()),out=await PDFDocument.create();
 if(source.getPageCount()>200)throw Error('Page organizer supports up to 200 pages.');
 for(let i=0;i<pages.length;i++){if(cancelled())throw Error('Cancelled');const item=pages[i];if(!Number.isInteger(item.page)||item.page<1||item.page>source.getPageCount()||![0,90,180,270].includes(item.rotation))throw Error('Invalid page layout.');const [page]=await out.copyPages(source,[item.page-1]);page.setRotation(degrees((page.getRotation().angle+item.rotation)%360));out.addPage(page);progress(Math.round((i+1)/pages.length*90))}
 if(cancelled())throw Error('Cancelled');const blob=new Blob([await out.save()],{type:'application/pdf'});blob.outputFormat='pdf';return blob;
}
