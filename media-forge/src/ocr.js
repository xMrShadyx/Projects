import {createWorker} from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';
import {PDFDocument} from 'pdf-lib';
import {pageNumbers} from './file-model.mjs';
pdfjs.GlobalWorkerOptions.workerSrc=new URL('vendor/pdf.worker.mjs',location.href).href;
export async function recognizeFile(file,s,ctx){
 if(file.size>25*1048576)throw Error('OCR limit: 25 MB per file.');
 if(!['eng','bul','eng+bul'].includes(s.ocrLanguage))throw Error('Choose an OCR language.');
 let worker,task,current=0,total=1,stopped=false,passwordRequested=false;
 const check=()=>{if(stopped||ctx.cancelled())throw Error('Cancelled')};
 const abort=new Promise((_,reject)=>{ctx.registerCancel?.(()=>{stopped=true;worker?.terminate();task?.destroy().catch(()=>{});reject(Error('Cancelled'))})});
 const run=async()=>{try{
  ctx.message('Loading OCR tools…');
  const workerPromise=createWorker(s.ocrLanguage,1,{workerPath:new URL('vendor/ocr/worker.min.js',location.href).href,corePath:new URL('vendor/ocr/core/',location.href).href,langPath:new URL('vendor/ocr/lang/',location.href).href.replace(/\/$/,''),workerBlobURL:false,errorHandler:()=>{},logger:m=>{if(stopped)return;if(m.status==='recognizing text'){ctx.message(`Recognizing page ${current+1} of ${total}…`);ctx.progress(Math.floor((current+Math.max(0,Math.min(1,m.progress||0)))/total*95))}else ctx.message(/language/i.test(m.status)?'Loading recognition language…':/load/i.test(m.status)?'Loading text recognition tools…':'Preparing text recognition…')}});
  workerPromise.then(w=>{if(stopped)w.terminate()}).catch(()=>{});worker=await workerPromise;check();await worker.setParameters({user_defined_dpi:'150'});
  const text=[],labels=[];let sourcePage=1;const out=s.format==='pdf'?await PDFDocument.create():null;
  async function recognize(canvas){check();ctx.message(`Recognizing page ${current+1} of ${total}…`);const {data}=await worker.recognize(canvas,{pdfTitle:'Media Forge OCR',pdfTextOnly:false},{text:true,pdf:!!out});check();text.push(data.text||'');labels.push(sourcePage);if(out){if(!data.pdf)throw Error('OCR did not produce a searchable page.');const pageDoc=await PDFDocument.load(new Uint8Array(data.pdf));for(const page of await out.copyPages(pageDoc,pageDoc.getPageIndices()))out.addPage(page)}current++;ctx.progress(Math.floor(current/total*95))}
  if(file.name.toLowerCase().endsWith('.pdf')){task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),standardFontDataUrl:new URL('vendor/standard_fonts/',location.href).href,cMapUrl:new URL('vendor/cmaps/',location.href).href,cMapPacked:true,wasmUrl:new URL('vendor/pdf-wasm/',location.href).href,isEvalSupported:false});task.onPassword=()=>{passwordRequested=true;task.destroy()};const pdf=await task.promise;check();const pages=pageNumbers(s.pages||'all',pdf.numPages);if(pages.length>20)throw Error('OCR supports up to 20 selected PDF pages per file.');total=pages.length;
   for(const n of pages){check();sourcePage=n;const page=await pdf.getPage(n),raw=page.getViewport({scale:1}),vp=page.getViewport({scale:Math.min(2.1,Math.sqrt(10e6/(raw.width*raw.height)))}),canvas=document.createElement('canvas');canvas.width=Math.ceil(vp.width);canvas.height=Math.ceil(vp.height);try{await page.render({canvas,canvasContext:canvas.getContext('2d'),viewport:vp,background:'rgb(255,255,255)'}).promise;await recognize(canvas)}finally{canvas.width=canvas.height=0;page.cleanup()}}
  }else{const image=await createImageBitmap(file);try{if(image.width*image.height>24e6)throw Error('OCR image limit: 24 megapixels.');const scale=Math.min(2,Math.sqrt(10e6/(image.width*image.height))),canvas=document.createElement('canvas');canvas.width=Math.ceil(image.width*scale);canvas.height=Math.ceil(image.height*scale);const c=canvas.getContext('2d');c.fillStyle='white';c.fillRect(0,0,canvas.width,canvas.height);c.drawImage(image,0,0,canvas.width,canvas.height);await recognize(canvas);canvas.width=canvas.height=0}finally{image.close()}}
  check();if(!text.some(t=>t.trim()))throw Error('No printed text was recognized. Choose the correct language and a clearer scan.');const blob=new Blob([out?await out.save():text.map((t,i)=>total>1?`Page ${labels[i]}\n${t}`:t).join('\n\n')],{type:out?'application/pdf':'text/plain;charset=utf-8'});blob.outputFormat=out?'pdf':'txt';return blob;
 }catch(e){if(passwordRequested&&!stopped)throw Error('Password-protected PDFs are not supported. Choose an unlocked copy.');throw e}finally{await worker?.terminate().catch(()=>{});await task?.destroy().catch(()=>{});ctx.registerCancel?.(null)}};
 return Promise.race([run(),abort]);
}
