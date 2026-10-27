import {characters} from './data';
import {FONT,loadDrawing,pngFile} from './export';
import {GAME_URL} from './links';
import {wrapText} from './text-layout';
import type {MutationReport} from './mutation';

export async function mutationCertificate(report:MutationReport):Promise<File>{
 await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1350;const c=canvas.getContext('2d');if(!c)throw Error('浏览器不支持图片绘制');
 const [oldImage,newImage]=await Promise.all([loadDrawing(report.previous),loadDrawing(report.current)]);const commands:(()=>void)[]=[];
 const text=(s:string,x:number,y:number,size=26,color='#242424',align:CanvasTextAlign='left',bold=false)=>commands.push(()=>{c.fillStyle=color;c.font=`${bold?'bold ':''}${size}px ${FONT}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillText(s,x,y)});
 const paragraph=(s:string,y:number)=>{c.font=`26px ${FONT}`;const lines=wrapText(s,684,t=>c.measureText(t).width);for(const line of lines){text(line,95,y);y+=43}return y};
 // Canvas emoji fallback varies by phone; keep the exported heading in reliable Chinese glyphs.
 const heading=report.title.replace(/^[^\u4e00-\u9fff]+/u,'');
 text('你是什么品种的废物？',450,91,40,'#242424','center',true);text('WHAT KIND OF USELESS ARE YOU?',450,133,18,'#777','center');text('人格变异观察报告',450,178,22,'#777','center');text(heading,450,238,42,'#FF6555','center',true);text(report.subtitle,450,278,22,'#777','center');
 commands.push(()=>{c.drawImage(oldImage,70,315,300,280);c.drawImage(newImage,530,315,300,280);c.strokeStyle='#242424';c.lineWidth=3;c.setLineDash([7,6]);c.beginPath();c.moveTo(400,462);c.quadraticCurveTo(443,448,497,462);c.stroke();c.setLineDash([]);c.strokeStyle='#FF6555';c.beginPath();c.moveTo(477,447);c.lineTo(499,462);c.lineTo(476,478);c.stroke()});
 text('上次人格',220,623,20,'#777','center');text('本次人格',680,623,20,'#777','center');text(characters[report.previous].name,220,669,31,'#242424','center',true);text(characters[report.current].name,680,669,31,'#242424','center',true);
 if(report.kind!=='changed')commands.push(()=>{c.save();c.translate(450,714);c.rotate(-.08);c.strokeStyle='#d94f41';c.fillStyle='#d94f41';c.lineWidth=3;c.strokeRect(-105,-26,210,45);c.font=`25px ${FONT}`;c.textAlign='center';c.fillText('稳定得可疑',0,5);c.restore()});
 let y=report.kind==='changed'?744:793;text('博士观察',95,y,22,'#d94f41');y=paragraph(report.observation,y+42)+20;text('研究结论',95,y,22,'#d94f41');y=paragraph(report.conclusion,y+42)+10;
 const footer=Math.max(1205,y+35);canvas.height=Math.max(1350,footer+135);c.fillStyle='#F8F5EF';c.fillRect(0,0,900,canvas.height);c.strokeStyle='#242424';c.lineWidth=4;c.strokeRect(30,30,840,canvas.height-60);commands.forEach(draw=>draw());
 c.fillStyle='#777';c.font=`21px ${FONT}`;c.textAlign='center';c.fillText('仅作娱乐观察 · 每一种形状，都允许继续变化。',450,footer);c.fillStyle='#242424';c.font=`18px ${FONT}`;c.fillText(GAME_URL,450,footer+48);c.fillStyle='#777';c.font=`18px ${FONT}`;c.fillText(`不正常人类研究所 · 第${String(report.sequence).padStart(3,'0')}号观察记录`,450,footer+84);
 return pngFile(canvas,`人格变异报告-${characters[report.previous].name}到${characters[report.current].name}.png`);
}
