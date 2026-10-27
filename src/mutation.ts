import {characters} from './data.ts';

export type MutationReport={kind:'changed'|'stable'|'resident';previous:number;current:number;sequence:number;streak:number;title:string;subtitle:string;observation:string;conclusion:string;announcement:string};
const stable:[string,string][]=[
 ['两次检测之间，你可能又想明白了一个问题，也可能只是把问题换了个名字。','思想持续发芽，土豆本体暂未申请搬家。'],
 ['你连第二次进门都自带开场白。研究所的空气已经认识你了。','请保留这份热情，同时给旁边的耳朵留个午休。'],
 ['两份报告都签了字，但你坚持把签名写在规定以外的位置。','反骨不是临时起意，是你自己选的行走方向。'],
 ['经过重复检测，你依然没有表现出任何想起床的迹象。','稳定得像池塘里的一块石头。石头还想向你学习。'],
 ['换了一套题，你仍然准确找到了研究所最安静的角落。','环境换了，角落里的小生态依然长得很好。'],
 ['看来你的脑洞已经形成了稳定的生态系统。每个点子都有自己的邻居。','本所暂时无法让这些点子排队，只能先扩建接待室。'],
 ['上次说的明天已经到了，你给它安排了另一个明天。','时间表持续延展，蜗牛本人没有丢失方向。'],
 ['第二份报告递过来之前，你先检查了一遍博士今天的语气。','温柔是常驻功能，别忘了也给自己垫一层软布。'],
 ['你两次都选中了靠近出口的位置，连门口的盆栽都觉得很熟悉。','外壳依然凉快，熟人频道正在稳定供暖。'],
 ['题目刚念完，你的钳子就已经圈出了多余的部分。','行动依旧利落，研究所的废话库存再次告急。'],
 ['你对第二次鉴定充满新鲜感，仿佛第一次还在另一个水缸。','快乐可以反复启动，重要的小事记得写在缸外。'],
 ['你精准避开了所有看起来会增加工作量的选项。屏幕甚至没有变暗。','节能策略运行稳定，建议定期保存休息成果。'],
];
const before=['替一颗土豆寻找宇宙坐标','把安静的电梯讲成了演出现场','给规则写不同意见','把日程泡进了池塘','在角落种植自己的小世界','给平行宇宙画创业草图','认真给明天安排另一个明天','反复检查消息里的标点','替所有聚会预留撤退通道','用钳子拆解无效流程','把旧笑话听成新发现','在工位缝隙里保护热带雨林'];
const after=['开始给晚饭追问存在的意义','主动为全世界暖场','决定绕开标准答案走走','批准自己先在荷叶上休息','选择在安静的地方慢慢生长','打开了一扇通往奇怪点子的窗','把开始按钮放进了明天的抽屉','想给每一种语气都加上缓冲垫','先在心里说完了自我介绍','先动手解决了拦路的麻烦','给生活按下了一次快乐重启','把空闲时间经营成了一门艺术'];
const shift=['脑洞窗口已重新调整，记得给点子留一条落地通道。','休息额度发生变化，研究所同意你重新安排荷叶的位置。','对外营业音量已调整，热闹和安静都可以按需取用。','与规则的距离发生变化，路标暂时保留讨论空间。','内心的小剧场换了排期，记得给主演留一点休息时间。','行动排班表已经更新，想法和脚步正在重新商量出发时间。'];
const special:Record<string,[string,string]>={
 '5-11':['你的大脑已经完成创业计划书，但身体决定提前退休。','你只是让想法和行动力实行了轮班制。一个负责开天窗，一个负责关闹钟。'],
 '11-5':['树懒刚把工位调成省电模式，狐狸已经把休息室改成了发明车间。','休息没有白费，攒下来的电量现在开始给脑洞供电。'],
 '3-9':['昨天的你还泡在池塘里，今天已经举着钳子催荷叶让路。','休息充满了电，只是电量先到了钳子上。'],
 '9-3':['钳子刚剪完一场会议，你就申请把会议室改成池塘。','行动之后也可以休息。横着走和躺着泡，都是你的路线。'],
 '1-8':['上次你让电梯变成舞台，这次你先替自己找好了观众席。','对外营业可以调小音量，热情并没有被退货。'],
 '8-1':['企鹅终于把心里的自我介绍说了出来，鸭子顺便加了三段返场。','熟人频道扩容成功，建议给新观众留个插话口。'],
};
export function mutationReport(history:readonly unknown[]):MutationReport|null{
 const valid=history.filter((x):x is number=>typeof x==='number'&&Number.isInteger(x)&&x>=0&&x<characters.length);
 if(valid.length<2)return null;const current=valid.at(-1)!,previous=valid.at(-2)!;let streak=1;for(let i=valid.length-2;i>=0&&valid[i]===current;i--)streak++;
 const sequence=valid.length;
 if(current===previous){const resident=streak>=3;return {kind:resident?'resident':'stable',previous,current,sequence,streak,title:resident?'🏆 人格钉子户':'🔬 人格稳定性异常！',subtitle:resident?`连续${streak===3?'三':streak}次鉴定结果完全一致。`:'本所怀疑你已经定型。',observation:stable[current][0],conclusion:resident?'恭喜，你已经成为本研究所的固定资产。请勿随意搬动，但可以随时休息。':stable[current][1],announcement:resident?'请勿搬动本所固定资产。':'重复实验成功，连淀粉都不想改配方。'};}
 const delta=characters[current].profile.map((n,i)=>Math.abs(n-characters[previous].profile[i]));const axis=delta.indexOf(Math.max(...delta));
 const [observation,conclusion]=special[`${previous}-${current}`]||[`上次你还在${before[previous]}，这次已经${after[current]}。博士决定给记录本多留一页。`,shift[axis]];
 return {kind:'changed',previous,current,sequence,streak,title:'⚠️ 检测到人格变异！',subtitle:`不正常人类研究所 · 第${String(sequence).padStart(3,'0')}号异常观察记录`,observation,conclusion,announcement:'新形状已登记，旧形状也有过功劳。'};
}
