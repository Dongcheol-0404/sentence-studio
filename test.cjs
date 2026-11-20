const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.value='';this.style={};this.classList={toggle(){}}}append(...els){this.children.push(...els)}replaceChildren(...els){this.children=els}setAttribute(){} }
const elements=new Map(),storage=new Map();
const ctx=vm.createContext({document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createElement:()=>new Element()},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},console,setTimeout,Blob,URL});
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('deck.questions.length'),5);
assert.equal(run('validDeck({title:"x",questions:[{chunks:["a",""],meaning:""}]})'),false);
assert.equal(run('validDeck({title:"x",questions:[{chunks:["a","b"],meaning:""}]})'),true);
run('selected=[2,1,0]; $("checkBtn").onclick()');assert.equal(run('status().wrong'),true);assert.equal(run('status().done'),false);
run('selected=[0,1,2]; $("checkBtn").onclick()');assert.equal(run('status().done'),true);assert.equal(run('$("nextBtn").hidden'),false);
run('review()');assert.equal(run('order.length'),1);assert.equal(run('status().done'),false);
run('$("hintBtn").onclick()');assert.equal(run('selected[0]'),0);assert.equal(run('status().hints'),1);
run('$("clearBtn").onclick()');assert.equal(run('selected.length'),0);
run('$("deckTitle").value="Test activity"; $("sentences").value="We / learn / together. | 우리는 함께 배운다."; $("teacherForm").onsubmit({preventDefault(){}})');assert.equal(run('deck.title'),'Test activity');assert.equal(run('deck.questions[0].chunks.length'),3);assert.ok(storage.get('sentence-studio-decks-v1'));
run('$("deckTitle").value="Invalid"; $("sentences").value="One unsplit sentence"; $("teacherForm").onsubmit({preventDefault(){}})');assert.equal(run('decks.length'),2);
run('deck.questions[0].chunks=["a","a","b"]; selected=[1,0,2]; $("checkBtn").onclick()');assert.equal(run('status().done'),true);
console.log('PASS: sample data, invalid input, wrong/correct answers, review, hints, reset, teacher save, persistence, duplicate chunks.');
