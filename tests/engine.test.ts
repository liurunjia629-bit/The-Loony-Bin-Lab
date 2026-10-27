import {test} from 'node:test';
import assert from 'node:assert/strict';
import {questions,characters} from '../src/data.ts';
import {sample,score,classify,match} from '../src/engine.ts';
test('30 original questions, 4 valid choices each',()=>{assert.equal(questions.length,30);assert.equal(new Set(questions.map(q=>q.text)).size,30);for(const q of questions){assert.equal(q.options.length,4);for(const a of q.options){assert.ok(a.weights.length<=2);assert.ok(a.weights.every(([i,w])=>i>=0&&i<6&&w>0));}}});
test('draw ten unique questions',()=>{for(let i=0;i<100;i++){const d=sample();assert.equal(d.length,10);assert.equal(new Set(d).size,10)}});
test('scoring adds exactly four points per answer and is stable',()=>{const a=sample().map(q=>({q,a:0}));const s=score(a);assert.equal(s.reduce((a,b)=>a+b,0),40);assert.equal(classify(s),classify(score(a)));});
test('all 12 profiles classify as themselves',()=>characters.forEach((c,i)=>assert.equal(classify(c.profile),i)));
test('all 144 matches symmetric, bounded and varied',()=>{const descriptions=new Set();for(let a=0;a<12;a++)for(let b=0;b<12;b++){const m=match(a,b);assert.deepEqual(m,match(b,a));assert.ok(m.chaos>=0&&m.chaos<=100);assert.ok(m.efficiency>=0&&m.efficiency<=100);descriptions.add(m.description)}assert.equal(descriptions.size,78)});
