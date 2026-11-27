const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.value='';this.style={};this.classList={toggle(){}}}append(...els){this.children.push(...els)}replaceChildren(...els){this.children=els}setAttribute(){} }
const elements=new Map(),storage=new Map();
const ctx=vm.createContext({document:{getElementById:id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createElement:()=>new Element()},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},console,setTimeout,Blob,URL});
vm.runInContext(fs.readFileSync('dist/grammar.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('dist/lessons.js','utf8'),ctx);
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
run('$("deckTitle").value="Invalid"; $("sentences").value="One unsplit sentence"; $("teacherForm").onsubmit({preventDefault(){}})');assert.equal(run('decks.length'),5);
run('deck.questions[0].chunks=["a","a","b"]; selected=[1,0,2]; $("checkBtn").onclick()');assert.equal(run('status().done'),true);
console.log('PASS: sample data, invalid input, wrong/correct answers, review, hints, reset, teacher save, persistence, duplicate chunks.');
run('start(demo)');
const change=level=>run(`$('difficultySelect').onchange({target:{value:${JSON.stringify(level)}}})`);
for(let i=0;i<5;i++){
  run(`position=${i};loadQuestion()`);
  const sentence=run("normalize(deck.questions[position].chunks.join(' '))");
  const counts=[];
  for(const level of ['easy','medium','hard']){
    change(level);
    assert.equal(run("normalize(current().chunks.join(' '))"),sentence);
    counts.push(run('current().chunks.length'));
    run('selected=current().chunks.map((_,i)=>i).reverse(); $("checkBtn").onclick()');
    assert.equal(run('status().wrong'),true);
    run('selected=current().chunks.map((_,i)=>i); $("checkBtn").onclick()');
    assert.equal(run('status().done'),true);
  }
  assert.ok(counts[0]<counts[1]&&counts[1]<counts[2]);
}
run("difficulty='medium';start(demo);status().done=true;status().wrong=true;selected=[0]");
change('hard');assert.equal(run('status().done'),false);assert.equal(run('status().wrong'),false);assert.equal(run('selected.length'),0);
run('$("hintBtn").onclick()');assert.equal(run('selected.length'),1);assert.equal(run('current().chunks[selected[0]]'),'Small');
change('medium');assert.equal(run('status().done'),true);assert.equal(run('status().wrong'),true);assert.equal(run('status().hints'),0);
run('review()');assert.equal(run('order.length'),1);assert.equal(run('difficulty'),'medium');
change('easy');assert.equal(run('reviewing'),false);assert.equal(run('order.length'),5);assert.equal(run('current().chunks.length'),2);
run('showSummary()');change('hard');assert.equal(run('$("summary").hidden'),true);assert.equal(run('$("exercise").hidden'),false);
run('start(decks[4])');assert.equal(run('$("difficultySelect").disabled'),true);assert.equal(run('difficulty'),'medium');change('hard');assert.equal(run('difficulty'),'medium');
assert.equal(run('hasLevels(JSON.parse(JSON.stringify(demo)))'),true);
assert.equal(run('hasLevels({questions:[{chunks:["a","b","c"],easyChunks:["a","wrong"]}]})'),false);
console.log('PASS: 15 sentence/level combinations, equivalent sentences, ordered chunk counts, separate progress, level switching, hints, review, summary, custom-deck fallback and portable level data.');
run('start(demo)');
for(let i=0;i<5;i++){
  run(`position=${i};loadQuestion()`);
  for(const level of ['easy','medium','hard']){
    change(level);
    assert.equal(run('!!grammarForCurrent()'),true);
    assert.equal(run("normalize(grammarForCurrent().parts.map(p=>p[1]).join(' '))"),run("normalize(current().chunks.join(' '))"));
    run('$("grammarBtn").onclick()');
    assert.equal(run('$("grammarPanel").hidden'),false);
    assert.equal(run('selected.length'),0);
    assert.equal(run('status().hints'),0);
    assert.equal(run('status().grammarHints'),1);
    run('$("grammarBtn").onclick()');assert.equal(run('$("grammarPanel").hidden'),true);
    run('selected=current().chunks.map((_,j)=>j);$("checkBtn").onclick()');
    assert.match(run('$("feedback").textContent'),/힌트 없이/);
  }
}
run('start(decks[4]);$("grammarBtn").onclick()');assert.equal(run('$("grammarBtn").disabled'),true);assert.equal(run('$("grammarPanel").hidden'),true);
run('start(demo);$("grammarBtn").onclick();position=1;loadQuestion()');assert.equal(run('grammarOpen'),false);
console.log('PASS: grammar data matches all 15 variants, open/close, separate hint counts, no answer mutation, honest success feedback and custom-activity fallback.');

// All built-in topics must offer the same complete exercise/grammar experience.
assert.equal(run('BUILTIN_DECKS.length'),4);
assert.equal(run('BUILTIN_DECKS.flatMap(d=>d.questions).length'),20);
assert.equal(run("new Set(BUILTIN_DECKS.flatMap(d=>d.questions.map(q=>normalize(q.chunks.join(' '))))).size"),20);
for(let d=0;d<4;d++){
  run(`start(BUILTIN_DECKS[${d}])`);
  assert.equal(run('validDeck(deck)&&hasLevels(deck)'),true);
  for(let q=0;q<5;q++){
    run(`position=${q};loadQuestion()`);
    const counts=[];
    for(const level of ['easy','medium','hard']){
      change(level);
      assert.equal(run("normalize(current().chunks.join(' '))"),run("normalize(deck.questions[position].chunks.join(' '))"));
      assert.equal(run("normalize(grammarForCurrent().parts.map(p=>p[1]).join(' '))"),run("normalize(current().chunks.join(' '))"));
      counts.push(run('current().chunks.length'));
      run('selected=current().chunks.map((_,i)=>i).reverse();$("checkBtn").onclick()');
      assert.equal(run('status().wrong'),true);
      run('selected=[];$("hintBtn").onclick();$("grammarBtn").onclick()');
      assert.equal(run('selected.length'),1);
      assert.equal(run('$("grammarPanel").hidden'),false);
      run('selected=current().chunks.map((_,i)=>i);$("checkBtn").onclick()');
      assert.equal(run('status().done'),true);
      assert.match(run('$("feedback").textContent'),/힌트 없이/);
    }
    assert.ok(counts[0]<counts[1]&&counts[1]<counts[2]);
  }
}
run('$("topicChoices").children[1].onclick()');
assert.equal(run('deck.id'),'school');
assert.equal(run('position'),0);
assert.equal(run('states.some(s=>s.done||s.wrong)'),false);
assert.equal(run('grammarOpen'),false);
run('persist()');
const saved=JSON.parse(storage.get('sentence-studio-decks-v1'));
assert.equal(saved.length,1);
assert.equal(saved[0].title,'Test activity');
// Reload legacy teacher data; built-ins must not multiply in browser storage.
const reload=vm.createContext({document:ctx.document,localStorage:ctx.localStorage,console,setTimeout,Blob,URL});
for(const file of ['grammar.js','lessons.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),reload);
assert.equal(vm.runInContext('decks.length',reload),5);
assert.equal(vm.runInContext('decks[4].title',reload),'Test activity');
console.log('PASS: 20 unique sentences × 3 levels, exact grammar coverage, grading, hints, topic reset, custom-only persistence and backward-compatible reload.');
