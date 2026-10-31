export function errorHelp(error){const text=String(error||'');
 if(/no extractable text|no readable text|scanned|need.*ocr/i.test(text))return{title:'This document needs text recognition',detail:'The pages may be scans or pictures. Use OCR to recognize printed text.',action:'ocr',label:'Open OCR tool'};
 if(/password|encrypt|unlocked/i.test(text))return{title:'This PDF is locked',detail:'Open it with its password in a PDF app, save an unlocked copy, then choose that copy here.',action:'choose',label:'Choose an unlocked PDF'};
 if(/memory|out of bounds|Aborted/i.test(text))return{title:'This file needs more memory',detail:'Try the Smaller file preset, a shorter clip, or a smaller input file.',action:'small',label:'Use smaller settings'};
 if(/download failed|network|fetch|load.*engine|load.*language/i.test(text))return{title:'A tool could not be downloaded',detail:'Check your connection, then retry. Your file has not been uploaded.',action:'retry',label:'Try again'};
 if(/no audio track|no audio stream/i.test(text))return{title:'This file has no audio track',detail:'Audio extraction needs a video with sound, or an audio file.',action:'choose',label:'Choose a file with audio'};
 if(/page range|page numbers|starting page|page.*between|at least one page/i.test(text))return{title:'Check your page selection',detail:'Choose pages that exist in the document and keep at least one page.',action:'settings',label:'Review page settings'};
 if(/timed out|timeout|too long/i.test(text))return{title:'This conversion took too long',detail:'Use a shorter clip or lower resolution, then try again.',action:'small',label:'Use smaller settings'};
 if(/No text.*found|no words|no (?:printed )?text.*recognized/i.test(text))return{title:'No printed text was recognized',detail:'Choose the correct OCR language and a clear, upright scan. Blank pages and handwriting may not produce text.',action:'settings',label:'Review OCR settings'};
 if(/limit|supports up to|exceeds|megapixels/i.test(text))return{title:'This file or selection is too large',detail:text.slice(0,220),action:/pages/i.test(text)?'settings':'choose',label:/pages/i.test(text)?'Choose fewer pages':'Choose a smaller file'};
 return{title:'This file could not be processed',detail:'It may be damaged or use an unsupported format. Try another file, or review the settings.',action:'choose',label:'Choose another file'};
}
