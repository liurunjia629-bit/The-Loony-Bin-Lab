import {renderToStaticMarkup} from 'react-dom/server';
import {Drawing} from './art';
import {characters,attrs} from './data';
import {match} from './engine';
function loadImage(src:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('插画加载失败'));i.src=src})}
export async function certificate(id:number,values:number[],friend?:number):Promise<File>{
 await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=900;canvas.height=friend===undefined?1500:1350;const c=canvas.getContext('2d');if(!c)throw Error('浏览器不支持图片绘制');
 c.fillStyle='#F8F5EF';c.fillRect(0,0,900,canvas.height);c.strokeStyle='#242424';c.lineWidth=4;c.strokeRect(30,30,840,canvas.height-60);
 const text=(s:string,x:number,y:number,size=28,color='#242424',align:CanvasTextAlign='left')=>{c.fillStyle=color;c.font=`${size>=40?'bold ':''}${size}px "Microsoft YaHei", "PingFang SC", sans-serif`;c.textAlign=align;c.fillText(s,x,y)};
 const wrap=(s:string,y:number,size=28)=>{c.font=`${size}px "Microsoft YaHei", "PingFang SC", sans-serif`;let line='',row=y;for(const char of s){if(c.measureText(line+char).width>710){text(line,95,row,size);line='';row+=size*1.6}line+=char}if(line)text(line,95,row,size);return row+size*1.6};
 const art=async(n:number,x:number,y:number,w:number)=>{const svg=renderToStaticMarkup(Drawing({id:n}));const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));try{const img=await loadImage(url);c.drawImage(img,x,y,w,w*280/300)}finally{URL.revokeObjectURL(url)}};
 text('不正常人类研究所 / POTATO LAB',450,96,23,'#242424','center');c.beginPath();c.moveTo(75,125);c.lineTo(825,125);c.stroke();
 if(friend===undefined){const ch=characters[id];text(`人格档案  NO. ${String(id+1).padStart(3,'0')}`,450,183,24,'#777','center');text(ch.name,450,255,64,'#242424','center');await art(id,210,280,480);text(`「${ch.claim}」`,450,766,28,'#242424','center');text(ch.traits.join('  /  '),450,820,25,'#777','center');let y=890;for(const [k,v] of [['特殊技能',ch.skill],['致命弱点',ch.weak],['荒诞职业',ch.job],['生活建议',ch.advice]]){text(k,95,y,22,'#FF6555');y=wrap(v,y+42,28)+22}const top=values.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v).slice(0,3);top.forEach(({v,i},n)=>{const x=95+n*240;text(attrs[i],x,1315,23);c.fillStyle='#dedbd3';c.fillRect(x,1336,190,12);c.fillStyle='#FF6555';c.fillRect(x,1336,190*v/(Math.max(...values)||1),12)});
 }else{const m=match(id,friend);text('双人研究报告',450,195,42,'#FF6555','center');await art(id,80,220,360);await art(friend,460,220,360);text(`${characters[id].name} × ${characters[friend].name}`,450,605,31,'#242424','center');text(m.name,450,700,54,'#242424','center');c.font='28px sans-serif';wrap(m.description,780);text(`搞事指数 ${m.chaos}%     合作效率 ${m.efficiency}%`,450,940,30,'#242424','center');text('推荐共同任务',95,1035,24,'#FF6555');wrap(m.task,1085);}
 text('仅供娱乐 · 每一种形状，都有自己的活法。',450,canvas.height-85,23,'#777','center');
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG生成失败')),'image/png'));return new File([blob],friend===undefined?`废物证书-${characters[id].name}.png`:'双人匹配报告.png',{type:'image/png'});
}
export function download(file:File){const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000)}
