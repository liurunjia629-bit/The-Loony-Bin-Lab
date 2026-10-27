export function wrapText(text:string,maxWidth:number,measure:(s:string)=>number):string[]{
 const units=typeof Intl.Segmenter==='function'?Array.from(new Intl.Segmenter('zh-CN',{granularity:'grapheme'}).segment(text),x=>x.segment):Array.from(text);
 const lines:string[]=[];let line='';
 for(const unit of units){if(unit==='\n'){lines.push(line);line='';continue}if(line&&measure(line+unit)>maxWidth){if(/^[，。！？；：、）》」】]/.test(unit)){line+=unit;lines.push(line);line=''}else{lines.push(line);line=unit}}else line+=unit}
 if(line)lines.push(line);return lines.length?lines:[''];
}
