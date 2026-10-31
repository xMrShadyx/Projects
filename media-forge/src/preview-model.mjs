export function previewKind(file,name=file.name||''){
 const ext=name.split('.').pop().toLowerCase();
 if(ext==='pdf'||file.type==='application/pdf')return 'pdf';
 if(['png','jpg','jpeg','webp','gif','bmp','avif','svg','ico'].includes(ext))return 'image';
 if(['mp4','webm','mov','mkv','avi','m4v','ogv'].includes(ext))return 'video';
 if(['mp3','wav','flac','ogg','m4a','aac','opus','aiff'].includes(ext))return 'audio';
 return null;
}
export function sizeChange(inputBytes,outputBytes){
 if(!Number.isFinite(inputBytes)||!Number.isFinite(outputBytes)||inputBytes<=0||outputBytes<0)return 'Size comparison unavailable';
 const percent=Math.round(Math.abs(outputBytes-inputBytes)/inputBytes*100);
 if(outputBytes===inputBytes)return 'Same file size';
 if(!percent)return outputBytes<inputBytes?'Slightly smaller':'Slightly larger';
 return `${percent}% ${outputBytes<inputBytes?'smaller':'larger'}`;
}
