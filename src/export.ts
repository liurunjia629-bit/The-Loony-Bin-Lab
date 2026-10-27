import {renderToStaticMarkup} from 'react-dom/server';
import {Drawing} from './art';
import {characters,attrs} from './data';
import {match} from './engine';
import {GAME_URL,inviteUrl} from './links';
import {wrapText} from './text-layout';
import {diagnosis} from './diagnosis';
const FONT='"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Heiti SC", sans-serif';
function loadImage(src:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const i=new Image();const t=setTimeout(()=>reject(new Error('插画加载超时')),15000);i.onload=()=>{clearTimeout(t);resolve(i)};i.onerror=()=>{clearTimeout(t);reject(new Error('插画加载失败'))};i.src=src})}
export async function certificate(id:number,values:number[],friend?:number):Promise<File>{
 if(!characters[id]||(friend!==undefined&&!characters[friend]))throw Error('无效的人格编号');await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1800;const c=canvas.getContext('2d');if(!c)throw Error('浏览器不支持图片绘制');
 const commands:(()=>void)[]=[];
 const text=(s:string,x:number,y:number,size=28,color='#242424',align:CanvasTextAlign='left')=>commands.push(()=>{c.fillStyle=color;c.font=`${size>=40?'bold ':''}${size}px ${FONT}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillText(s,x,y)});
 const paragraph=(s:string,y:number,size=28,center=false)=>{c.font=`${size>=40?'bold ':''}${size}px ${FONT}`;const lines=wrapText(s,710-size,t=>c.measureText(t).width);for(const line of lines){text(line,center?450:95,y,size,'#242424',center?'center':'left');y+=size*1.65}return y};
 const art=async(n:number,x:number,y:number,w:number)=>{const svg=renderToStaticMarkup(Drawing({id:n}));const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));try{const img=await loadImage(url);commands.push(()=>c.drawImage(img,x,y,w,w*280/300))}finally{URL.revokeObjectURL(url)}};
 text('你是什么品种的废物？',450,100,43,'#242424','center');text('WHAT KIND OF USELESS ARE YOU?',450,142,19,'#777','center');text('不正常人类研究所 / POTATO LAB',450,185,22,'#777','center');
 commands.push(()=>{c.strokeStyle='#242424';c.lineWidth=2;c.beginPath();c.moveTo(75,215);c.lineTo(825,215);c.stroke()});let y:number;
 if(friend===undefined){const ch=characters[id];text(`人格档案  NO. ${String(id+1).padStart(3,'0')}`,450,268,23,'#777','center');text(ch.name,450,340,64,'#242424','center');await art(id,245,350,410);y=paragraph(`「${ch.claim}」`,775,29,true);y=paragraph(ch.traits.join('  /  '),y+12,24,true)+30;
  for(const [label,value] of [['特殊技能',ch.skill],['致命弱点',ch.weak],['荒诞职业',ch.job],['生活建议',ch.advice]]){text(label,95,y,22,'#FF6555');y=paragraph(value,y+42,28)+22}
  const report=diagnosis(values);text('博士的最终诊断 · 娱乐版',95,y,22,'#FF6555');y=paragraph(report.text,y+42,26)+25;
  const top=values.map((v,i)=>({v:Math.max(0,Number.isFinite(v)?v:0),i})).sort((a,b)=>b.v-a.v||a.i-b.i).slice(0,3);y+=15;const barY=y;
  top.forEach(({v,i},n)=>{const x=95+n*240;text(attrs[i],x,barY,23);commands.push(()=>{c.fillStyle='#dedbd3';c.fillRect(x,barY+19,190,10);c.fillStyle='#FF6555';c.fillRect(x,barY+19,190*v/(Math.max(...values,1)),10)})});y+=80;
 }else{const m=match(id,friend);text('双人研究报告',450,282,42,'#FF6555','center');await art(id,80,305,350);await art(friend,470,305,350);y=paragraph(`${characters[id].name} × ${characters[friend].name}`,685,30,true)+20;y=paragraph(m.name,y,46,true)+18;y=paragraph(m.description,y,28)+25;text(`搞事指数 ${m.chaos}%     合作效率 ${m.efficiency}%`,450,y,29,'#242424','center');y+=75;text('最适合一起完成',95,y,23,'#FF6555');y=paragraph(m.task,y+45,28)+25;}
 const footer=Math.max(friend===undefined?1450:1240,y+25);canvas.height=Math.ceil(footer+210);
 c.fillStyle='#F8F5EF';c.fillRect(0,0,900,canvas.height);c.strokeStyle='#242424';c.lineWidth=4;c.strokeRect(30,30,840,canvas.height-60);commands.forEach(draw=>draw());
 c.textAlign='center';c.fillStyle='#777';c.font=`22px ${FONT}`;c.fillText('仅供娱乐 · 每一种形状，都有自己的活法。',450,footer);c.font=`24px ${FONT}`;c.fillStyle='#242424';c.fillText('来研究所，认领你的物种 ↓',450,footer+55);c.font=`18px ${FONT}`;c.fillText(GAME_URL,450,footer+96);c.fillStyle='#777';c.font=`17px ${FONT}`;c.fillText(friend===undefined?`邀请编号 ${id} · ${inviteUrl(id)}`:'双人报告 · 本地规则生成',450,footer+133);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('PNG生成失败，请尝试系统浏览器')),'image/png'));return new File([blob],friend===undefined?`废物证书-${characters[id].name}.png`:'双人匹配报告.png',{type:'image/png'});
}
export function download(file:File){const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
