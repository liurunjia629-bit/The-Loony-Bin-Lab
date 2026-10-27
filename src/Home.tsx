import {useEffect,useRef,useState} from 'react';
import {Drawing} from './art';
import {characters,reactions} from './data';
import './home.css';

const footnotes=[
 '研究所今日发现：发呆时，大脑也可能只是忘了关灯。',
 '本所承诺：不解决任何问题，但会认真给问题取名字。',
 '据不完全统计，所有土豆都没有回复过工作消息。',
 '温馨提示：人生没有标准答案，本所甚至没有标准问题。',
 '今日科研进展：成功把“再等五分钟”延长至下午。',
 '经费公示：三块五买了土豆，剩余预算用于思考。',
];
const idleLines=['你不动，我差点以为我们在合影。','慢慢来。我的下一个预约是一颗发芽的土豆。','研究发现：盯着土豆，不会自动完成鉴定。'];
const intros:Record<number,string>={2:'规则看了，但猫有自己的版本。',3:'别催，池塘暂时没有紧急事项。',4:'正在角落进行无声的光合作用。',8:'熟人限定，陌生人请先预热。'};
const pick=(lines:string[],previous='')=>{const options=lines.filter(line=>line!==previous);return options[Math.floor(Math.random()*options.length)]};

export function Home({initialLine,onStart,onPreview,onCollection}:{initialLine:string;onStart:()=>void;onPreview:(id:number)=>void;onCollection:()=>void}){
 const [line,setLine]=useState(initialLine),[mood,setMood]=useState('welcome'),[starting,setStarting]=useState(false),[poke,setPoke]=useState(0),[footnote]=useState(()=>pick(footnotes));
 const doctor=useRef<HTMLButtonElement>(null),lastActivity=useRef(Date.now()),clicks=useRef({time:0,count:0}),startLock=useRef(false);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;let target={x:0,y:0};let nextIdle=26000;
  const activity=()=>{lastActivity.current=Date.now();nextIdle=26000};
  const resetEyes=()=>{doctor.current?.style.setProperty('--look-x','0px');doctor.current?.style.setProperty('--look-y','0px')};
  const move=(e:PointerEvent)=>{activity();if(e.pointerType!=='mouse'||media.matches)return;const box=doctor.current?.getBoundingClientRect();if(!box)return;target={x:Math.max(-3,Math.min(3,(e.clientX-(box.left+box.width*.48))/100)),y:Math.max(-2,Math.min(2,(e.clientY-(box.top+box.height*.49))/120))};if(!frame)frame=requestAnimationFrame(()=>{doctor.current?.style.setProperty('--look-x',`${target.x}px`);doctor.current?.style.setProperty('--look-y',`${target.y}px`);frame=0})};
  const change=()=>{if(media.matches){cancelAnimationFrame(frame);frame=0;resetEyes()}};
  const visible=()=>{activity();resetEyes()};
  const idle=setInterval(()=>{if(document.hidden||startLock.current)return;if(Date.now()-lastActivity.current>=nextIdle){setLine(prev=>pick(idleLines,prev));setMood('thinking');nextIdle+=45000+Math.random()*20000}},1000);
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',activity,{passive:true});window.addEventListener('keydown',activity);window.addEventListener('scroll',activity,{passive:true});document.addEventListener('visibilitychange',visible);document.documentElement.addEventListener('pointerleave',resetEyes);media.addEventListener('change',change);
  return()=>{clearInterval(idle);cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',activity);window.removeEventListener('keydown',activity);window.removeEventListener('scroll',activity);document.removeEventListener('visibilitychange',visible);document.documentElement.removeEventListener('pointerleave',resetEyes);media.removeEventListener('change',change)};
 },[]);
 useEffect(()=>{if(!starting)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const t=setTimeout(onStart,reduced?450:1000);return()=>clearTimeout(t)},[starting,onStart]);
 const tapDoctor=()=>{if(startLock.current)return;const now=Date.now();const count=now-clicks.current.time<1500?clicks.current.count+1:1;clicks.current={time:now,count};setPoke(n=>n+1);setMood(count>=3?'speechless':'shock');setLine(count>=7?'再戳就要按土豆泥的价格收费了。':count>=5?'我不是触屏电梯，不用一直按。':count>=3?'第三次了。你是在鉴定我，还是在给土豆去皮？':pick(reactions,line))};
 const begin=()=>{if(startLock.current)return;startLock.current=true;setLine('请把理智留在门口。好，开始鉴定！');setMood('announce');setStarting(true)};
 return <section className={`home entrance ${starting?'home-starting':''}`} aria-busy={starting}>
  <div className="edition">人格研究计划 / VOL. 001 <span>100% 不科学</span></div>
  <div className="hero"><div className="hero-copy"><p className="eyebrow"><span/> A VERY UNOFFICIAL PERSONALITY TEST</p><h1>你是什么<br/>品种的<span className="red-word">废物<svg viewBox="0 0 260 24" aria-hidden="true"><path d="M5 15Q99 0 253 13M15 22Q135 12 238 22"/></svg></span><span className="question">？</span></h1><p className="subtitle">一场极其不严谨的人格鉴定。</p><p className="intro">有人活成了一束光，有人活成了一颗土豆。<br/>没关系，先来认领一下你的物种。</p><div className="home-actions"><button className="primary start-button" disabled={starting} onClick={begin}>{starting?'博士准备中…':'开始鉴定'} <span>↗</span></button><span className="time-note">10 道怪问题<br/>约 2 分钟，放心浪费</span></div><p className="tiny">无需登录 · 没有标准答案 · 放下你的包袱</p></div>
  <div className="hero-art"><div className="speech" role="status" aria-live="polite" aria-atomic="true">{line}</div><span className="orbit one">正常？<br/>不在业务范围内。</span><span className="spark">✳</span><button ref={doctor} className="doctor-button" onClick={tapDoctor} disabled={starting} aria-label="戳一戳土豆博士" aria-describedby="doctor-hint"><span key={poke} className={poke?'doctor-poke':'doctor-rest'}><Drawing doctor mood={mood}/></span></button><span className="doctor-label">Dr. Potato <span>土豆博士</span></span><span className="annotation" id="doctor-hint">↑ 戳它。它看起来很闲。</span><span className="seal">不 正 常<br/><b>合 格</b><br/>研究所认证</span></div></div>
  <div className="bottom-strip"><div><span className="index">01—12</span><p>十二种废物，<br/><b>总有一种是你。</b></p></div><div className="mini-creatures">{[2,3,4,8].map(i=><button className="creature-preview" key={i} onClick={()=>onPreview(i)} aria-label={`查看${characters[i].name}档案`} aria-describedby={`preview-${i}`}><Drawing id={i}/><span className="preview-caption" id={`preview-${i}`} role="tooltip"><b>{characters[i].name}</b><span>{intros[i]}</span></span></button>)}</div><button className="text-link" onClick={onCollection}>翻开废物图鉴 <span>⟶</span></button></div>
  <p className="home-footnote">{footnote}</p><p className="disclaimer">本测试仅供娱乐，请勿用于招聘、相亲或决定晚饭吃什么。</p>
 </section>;
}
