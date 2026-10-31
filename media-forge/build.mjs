import {build} from 'esbuild';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const fontPath='public/NotoSans-Regular.ttf';
try{await fs.access(fontPath)}catch{
 const response=await fetch('https://raw.githubusercontent.com/notofonts/noto-fonts/ffebf8c1ee449e544955a7e813c54f9b73848eac/hinted/ttf/NotoSans/NotoSans-Regular.ttf');
 if(!response.ok)throw Error('Could not download the Noto Sans PDF font. Check your connection.');
 await fs.writeFile(fontPath,new Uint8Array(await response.arrayBuffer()));
}
if(createHash('sha256').update(await fs.readFile(fontPath)).digest('hex')!=='b85c38ecea8a7cfb39c24e395a4007474fa5a4fc864f6ee33309eb4948d232d5')throw Error('Noto Sans font integrity check failed.');
await fs.mkdir('dist/chunks',{recursive:true});
for(const file of await fs.readdir('dist/chunks'))if(file.endsWith('.js'))await fs.unlink('dist/chunks/'+file);
await fs.mkdir('dist/licenses',{recursive:true});
for(const name of ['@ffmpeg/ffmpeg','fflate','pdf-lib','pdfjs-dist','@pdf-lib/fontkit','mammoth','docx','exceljs','pptxgenjs','jszip','papaparse','tesseract.js','tesseract.js-core','@tesseract.js-data/eng','@tesseract.js-data/bul']){const dir='node_modules/'+name;for(const file of await fs.readdir(dir))if(/^licen[cs]e|^copying|^notice/i.test(file))await fs.copyFile(dir+'/'+file,'dist/licenses/'+name.replace('/','-')+'-'+file).catch(()=>{});}
await fs.copyFile('THIRD_PARTY.md','dist/licenses/THIRD_PARTY.md');
await fs.mkdir('dist/vendor',{recursive:true});
await fs.cp('public','dist',{recursive:true});
await fs.copyFile('src/model.mjs','dist/model.mjs');
await fs.copyFile('src/file-model.mjs','dist/file-model.mjs');
await fs.copyFile('node_modules/pdfjs-dist/build/pdf.worker.mjs','dist/vendor/pdf.worker.mjs');
await fs.cp('node_modules/pdfjs-dist/standard_fonts','dist/vendor/standard_fonts',{recursive:true});
await fs.cp('node_modules/pdfjs-dist/cmaps','dist/vendor/cmaps',{recursive:true});
await fs.cp('node_modules/pdfjs-dist/wasm','dist/vendor/pdf-wasm',{recursive:true});
await fs.copyFile('node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js','dist/vendor/worker.js');
for(const f of ['const.js','errors.js'])await fs.copyFile('node_modules/@ffmpeg/ffmpeg/dist/esm/'+f,'dist/vendor/'+f);
await fs.copyFile('node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js','dist/vendor/ffmpeg-core.js');
// Keep the large, unchanged engine on its official version-pinned CDN.
// Media bytes remain in browser memory; the CDN receives only an engine request.
await fs.mkdir('dist/vendor/ocr/core',{recursive:true});
await fs.mkdir('dist/vendor/ocr/lang',{recursive:true});
await fs.copyFile('node_modules/tesseract.js/dist/worker.min.js','dist/vendor/ocr/worker.min.js');
for(const file of await fs.readdir('node_modules/tesseract.js-core'))if(file.endsWith('.wasm.js'))await fs.copyFile('node_modules/tesseract.js-core/'+file,'dist/vendor/ocr/core/'+file);
for(const lang of ['eng','bul'])await fs.copyFile('node_modules/@tesseract.js-data/'+lang+'/4.0.0_best_int/'+lang+'.traineddata.gz','dist/vendor/ocr/lang/'+lang+'.traineddata.gz');
await build({entryPoints:['src/app.js'],bundle:true,format:'esm',outdir:'dist',splitting:true,chunkNames:'chunks/[name]-[hash]',target:['es2022'],minify:true});
console.log('Media Forge built.');

