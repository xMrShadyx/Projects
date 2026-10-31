import {PDFDocument,degrees} from 'pdf-lib';

// Place a transparent overlay in displayed page coordinates, including crop and rotation.
export function overlayPlacement(page){
 const b=page.getCropBox(),r=((page.getRotation().angle%360)+360)%360;
 if(r===90)return{x:b.x+b.width,y:b.y,width:b.height,height:b.width,rotate:degrees(90)};
 if(r===180)return{x:b.x+b.width,y:b.y+b.height,width:b.width,height:b.height,rotate:degrees(180)};
 if(r===270)return{x:b.x,y:b.y+b.height,width:b.height,height:b.width,rotate:degrees(270)};
 if(r!==0)throw Error('Unsupported PDF page rotation.');
 return{x:b.x,y:b.y,width:b.width,height:b.height,rotate:degrees(0)};
}
export async function savePdfOverlays(file,layers,{progress=()=>{},cancelled=()=>false}={}){
 if(file.size>25*1048576)throw Error('PDF limit: 25 MB.');
 const pdf=await PDFDocument.load(await file.arrayBuffer());
 if(pdf.getPageCount()>200)throw Error('PDF editor supports up to 200 pages.');
 if(!layers.length)throw Error('Add text, an image or a drawing before saving.');
 for(let i=0;i<layers.length;i++){
  if(cancelled())throw Error('Cancelled');
  const layer=layers[i];
  if(!Number.isInteger(layer.page)||layer.page<1||layer.page>pdf.getPageCount())throw Error('Invalid overlay page.');
  const page=pdf.getPage(layer.page-1),image=await pdf.embedPng(layer.png);
  page.drawImage(image,overlayPlacement(page));progress(Math.round((i+1)/layers.length*90));
 }
 if(cancelled())throw Error('Cancelled');
 const blob=new Blob([await pdf.save()],{type:'application/pdf'});blob.outputFormat='pdf';return blob;
}
