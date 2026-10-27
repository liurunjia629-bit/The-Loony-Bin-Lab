import {useState} from 'react';
import {characters} from './data';
import {Drawing} from './art';
import type {MutationReport} from './mutation';
import './mutation.css';

export function MutationObservation({report,onSave,busy}:{report:MutationReport;onSave:()=>void;busy:boolean}){
 const [expanded,setExpanded]=useState(true);const stable=report.kind!=='changed';
 return <section className={`mutation-observation ${stable?'mutation-stable':'mutation-changed'}`} aria-label="人格变异观察报告">
  <details open={expanded} onToggle={e=>setExpanded(e.currentTarget.open)}>
   <summary><span className="eyebrow">人格变异观察报告</span><h3>{report.title}</h3><span className="mutation-fold">{expanded?'收起报告 −':'展开报告 ＋'}</span></summary>
   <div className="mutation-body"><p className="mutation-subtitle">{report.subtitle}</p>
    <div className="mutation-pair"><figure className="mutation-before"><Drawing id={report.previous}/><figcaption><small>上次人格</small>{characters[report.previous].name}</figcaption></figure>
     <svg className="mutation-arrow" viewBox="0 0 90 50" aria-label={stable?'保持同一人格':'人格发生变化'} role="img"><path d="M7 29Q38 13 78 23" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 4"/><path d="m62 11 18 12-20 11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
     <figure className="mutation-after"><Drawing id={report.current}/><figcaption><small>本次人格</small>{characters[report.current].name}</figcaption></figure></div>
    {stable&&<div className="mutation-stamp">稳定得可疑</div>}
    <dl><div><dt>博士观察</dt><dd>{report.observation}</dd></div><div><dt>研究结论</dt><dd>{report.conclusion}</dd></div></dl>
    <div className="mutation-doctor"><Drawing doctor mood="announce"/><p>土豆博士：{report.announcement}</p></div>
    <p className="tiny">仅作娱乐观察。每一种形状，都允许继续变化。</p>
    <button className="outline mutation-save" disabled={busy} onClick={onSave}>{busy?'正在绘制报告…':'保存人格变异报告 ↓'}</button>
   </div>
  </details>
 </section>;
}
