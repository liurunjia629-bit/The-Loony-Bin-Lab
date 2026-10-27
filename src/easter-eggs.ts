export const eggs=[
 {id:'triple',name:'人格钉子户',text:'连续三次同人格。恭喜，你已成为本研究所的固定资产。'},
 {id:'six',name:'半个研究员',text:'六种物种已报到。你可以领半件白大褂。'},
 {id:'all',name:'废物百科全书',text:'十二种基础人格集齐。馆长把钥匙递给了你。'},
 {id:'potato',name:'主食哲学家',text:'变成土豆还在思考分类。食堂愿意旁听。'},
 {id:'porridge',name:'粥类气象员',text:'你宣布粥是一种天气。明天局部有葱花。'},
 {id:'same',name:'同一个模子',text:'与邀请者同物种。你们的默契按吨结算。'},
 {id:'rapid',name:'不服研究所',text:'十分钟内开始三次鉴定。博士正在检查印章。'},
 {id:'printer',name:'纸张急救员',text:'你决定救助打印机。机器也记住了你的善意。'},
] as const;
export type EggId=typeof eggs[number]['id'];
export function discoverEggs(input:{history:number[];unlocked:number[];answers:{q:number;a:number}[];result:number;friend?:number|null;starts:number[];now:number}):EggId[]{const {history,unlocked,answers,result,friend,starts,now}=input;return eggs.filter(e=>({triple:history.some((x,i)=>i>=2&&x===history[i-1]&&x===history[i-2]),six:unlocked.length>=6,all:unlocked.length===12,potato:answers.some(x=>x.q===0&&x.a===3),porridge:answers.some(x=>x.q===8&&x.a===2),same:friend!==null&&friend!==undefined&&friend===result,rapid:starts.filter(t=>t<=now&&now-t<=600000).length>=3,printer:answers.some(x=>x.q===9&&x.a===0)})[e.id]).map(e=>e.id)}
