import {test} from 'node:test';
import assert from 'node:assert/strict';
import {previewKind,sizeChange} from '../src/preview-model.mjs';
import {makeResult} from '../src/results.mjs';
test('previews distinguish real supported display types from document and archive outputs',()=>{for(const [name,kind]of [['page.PDF','pdf'],['photo.webp','image'],['loop.gif','image'],['clip.mp4','video'],['song.wav','audio'],['pages.zip',null],['doc.docx',null],['picture.tiff',null]])assert.equal(previewKind(new File(['x'],name)),kind)});
test('size comparison reports both growth and shrinkage without claiming a saving for growth',()=>{assert.equal(sizeChange(1000,500),'50% smaller');assert.equal(sizeChange(1000,1500),'50% larger');assert.equal(sizeChange(100,100),'Same file size');assert.equal(sizeChange(1000,1001),'Slightly larger');assert.equal(sizeChange(0,100),'Size comparison unavailable')});
test('comparison keeps original bytes after source rows are removed, including all merge inputs',async()=>{const files=[new File(['first'],'one.pdf'),new File(['second'],'two.pdf')],rows=files.map((file,i)=>({id:String(i),file}));const r=makeResult(rows,new Blob(['merged']),{mode:'pdfTools',pdfAction:'merge',format:'pdf'});rows.length=0;assert.equal(r.sourceBytes,11);assert.equal(r.sourceFiles.length,2);assert.equal(await r.sourceFiles[1].text(),'second');assert.throws(()=>r.sourceFiles.pop())});
