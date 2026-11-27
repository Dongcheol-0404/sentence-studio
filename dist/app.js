const $=id=>document.getElementById(id);
const demo={id:'sample',title:'일상을 바꾸는 작은 생각',questions:[{chunks:['Small actions','can make','a big difference.'],meaning:'작은 행동이 큰 변화를 만들 수 있다.'},{chunks:['Technology','has changed','the way we live.'],meaning:'기술은 우리가 살아가는 방식을 바꾸었다.'},{chunks:['What matters most','is not the result','but the effort.'],meaning:'가장 중요한 것은 결과가 아니라 노력이다.'},{chunks:['By listening to others,','we can learn','to see the world','from different perspectives.'],meaning:'다른 사람의 말을 들음으로써 우리는 다양한 관점에서 세상을 보는 법을 배울 수 있다.'},{chunks:['The more we practice,','the more confident','we become.'],meaning:'우리가 더 많이 연습할수록, 더 자신감이 생긴다.'}]};
const easyGroups = [
  ['Small actions', 'can make a big difference.'],
  ['Technology has changed', 'the way we live.'],
  ['What matters most', 'is not the result but the effort.'],
  ['By listening to others,', 'we can learn to see the world from different perspectives.'],
  ['The more we practice,', 'the more confident we become.']
];
demo.questions.forEach((q,i)=>{q.easyChunks=easyGroups[i]});
const normalize = text => text.trim().replace(/\s+/g,' ');
function hasLevels(d){return d.questions.every(q=>Array.isArray(q.easyChunks)&&q.easyChunks.length>=2&&q.easyChunks.length<q.chunks.length&&q.easyChunks.every(c=>typeof c==='string'&&c.trim())&&normalize(q.easyChunks.join(' '))===normalize(q.chunks.join(' ')))}
let difficulty='medium',levelStates={};
const levelNames={easy:'하 · 큰 의미 단위',medium:'중 · 구 단위',hard:'상 · 단어 단위'};
function newStates(){return deck.questions.map(()=>({done:false,wrong:false,hints:0}))}
function updateDifficulty(){
  const enabled=hasLevels(deck);
  $('difficultySelect').disabled=!enabled;
  $('difficultySelect').value=difficulty;
  $('difficultyHelp').textContent=enabled?'난이도별 완료·오답 기록은 따로 유지됩니다. 바꾸면 조립 중인 문장은 초기화됩니다.':'직접 만든 활동은 교사가 나눈 어구를 그대로 사용합니다. 난이도 선택은 예제 활동에서 이용하세요.';
}
$('difficultySelect').onchange=e=>{
  const next=e.target.value;
  if(!hasLevels(deck)||!Object.hasOwn(levelNames,next)||next===difficulty)return;
  const questionIndex=order[position];
  difficulty=next;
  states=levelStates[next]||(levelStates[next]=newStates());
  order=deck.questions.map((_,i)=>i);position=questionIndex;reviewing=false;
  updateDifficulty();loadQuestion();
};
const KEY='sentence-studio-decks-v1';
function validDeck(d){return d&&typeof d.title==='string'&&d.title.trim().length>0&&d.title.length<=60&&Array.isArray(d.questions)&&d.questions.length>0&&d.questions.length<=50&&d.questions.every(q=>q&&Array.isArray(q.chunks)&&q.chunks.length>=2&&q.chunks.length<=20&&q.chunks.every(c=>typeof c==='string'&&c.trim().length>0&&c.length<=200)&&typeof q.meaning==='string'&&q.meaning.length<=500)}
let custom=[];try{let data=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(data))custom=data.filter(validDeck).map((d,i)=>({...d,id:'saved-'+i}))}catch{}
const BUILTIN_DECKS=[demo,...EXTRA_LESSONS];
demo.shortTitle='일상과 성장';
let decks=[...BUILTIN_DECKS,...custom],deck=demo,order=[],position=0,states=[],selected=[],shuffled=[],reviewing=false;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(decks.filter(d=>!BUILTIN_DECKS.includes(d))));return true}catch{return false}}
function shuffle(ids){let a=[...ids];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(a.every((v,i)=>v===ids[i])&&a.length>1)a.push(a.shift());return a}
function renderSelect(){ $('deckSelect').replaceChildren(...decks.map(d=>{let o=document.createElement('option');o.value=d.id;o.textContent=d.title+' ('+d.questions.length+'문장)';return o}));$('deckSelect').value=deck.id;renderTopics();}
function renderTopics(){
  $('topicChoices').replaceChildren(...BUILTIN_DECKS.map(d=>{const b=document.createElement('button');b.textContent=d.shortTitle+' · '+d.questions.length;b.className='topic-chip';b.setAttribute('aria-pressed',String(d===deck));b.onclick=()=>start(d);return b}));
  $('activeTopic').textContent=deck.title;
}
function start(d){deck=d;order=d.questions.map((_,i)=>i);position=0;reviewing=false;if(!hasLevels(d))difficulty='medium';levelStates={};states=levelStates[difficulty]=newStates();renderSelect();updateDifficulty();loadQuestion()}
function current(){
  const q=deck.questions[order[position]];
  if(!hasLevels(deck))return q;
  const chunks=difficulty==='hard'?q.chunks.join(' ').trim().split(/\s+/):difficulty==='easy'?q.easyChunks:q.chunks;
  return {...q,chunks};
}
function status(){return states[order[position]]}
function sidebar(){ $('deckCount').textContent=deck.questions.length+'개 문장';$('wrongCount').textContent=states.filter(s=>s.wrong).length;$('reviewBtn').disabled=!states.some(s=>s.wrong);$('questionList').replaceChildren(...deck.questions.map((q,i)=>{let b=document.createElement('button');b.className=i===order[position]?'current':'';b.setAttribute('aria-label',`${i+1}번 문장${states[i].done?', 완료':''}`);for(const [cls,txt] of [['num',String(i+1).padStart(2,'0')],['q-title',q.chunks[0].slice(0,17)],['state',states[i].done?'✓':states[i].wrong?'↺':'']]){let s=document.createElement('span');s.className=cls;s.textContent=txt;b.append(s)}b.onclick=()=>{reviewing=false;order=deck.questions.map((_,j)=>j);position=i;loadQuestion()};return b}));}
function loadQuestion(){grammarOpen=false;selected=[];shuffled=shuffle(current().chunks.map((_,i)=>i));$('summary').hidden=true;$('exercise').hidden=false;$('feedback').textContent='';$('feedback').className='feedback';$('questionNumber').textContent=`SENTENCE ${String(order[position]+1).padStart(2,'0')}`;$('meaning').textContent=current().meaning||'어구를 연결해 문장을 완성해 보세요.';$('sessionLabel').textContent=(reviewing?'오답 다시 풀기':'문장 조립 연습')+' · '+(hasLevels(deck)?levelNames[difficulty]:'교사 지정 어구');$('nextBtn').hidden=true;$('checkBtn').hidden=false;$('hintBtn').disabled=false;$('clearBtn').disabled=false;draw();sidebar();renderGrammar()}
function draw(){const q=current();$('answer').replaceChildren();if(!selected.length){let p=document.createElement('span');p.className='placeholder';p.textContent='이곳에 문장을 완성해 보세요';$('answer').append(p)}selected.forEach((id,idx)=>{$('answer').append(chunk(q.chunks[id],()=>{selected.splice(idx,1);clearFeedback();draw()}))});$('bank').replaceChildren(...shuffled.map(id=>{let b=chunk(q.chunks[id],()=>{selected.push(id);clearFeedback();draw()});b.disabled=selected.includes(id);return b}));$('checkBtn').disabled=selected.length!==q.chunks.length;$('hintCount').textContent=status().hints?`· ${status().hints}회`:'';let done=order.filter(i=>states[i].done).length;$('progressText').textContent=`${position+1} / ${order.length} 문장 · ${done}개 완료`;$('progressBar').style.width=`${done/order.length*100}%`;}
function chunk(text,click){let b=document.createElement('button');b.className='chunk';b.textContent=text;b.onclick=click;return b}
function clearFeedback(){$('feedback').textContent='';$('feedback').className='feedback';$('checkBtn').hidden=false;$('nextBtn').hidden=true;$('hintBtn').disabled=false}
$('clearBtn').onclick=()=>{selected=[];clearFeedback();draw()};
$('hintBtn').onclick=()=>{let q=current();let prefix=0;while(prefix<selected.length&&q.chunks[selected[prefix]]===q.chunks[prefix])prefix++;if(prefix===q.chunks.length)return;selected=selected.slice(0,prefix);let id=q.chunks.findIndex((c,i)=>!selected.includes(i)&&c===q.chunks[prefix]);selected.push(id);status().hints++;clearFeedback();draw();$('feedback').textContent='다음 어구를 놓았어요. 이어지는 문장을 생각해 보세요.'};
$('checkBtn').onclick=()=>{let q=current();if(selected.length!==q.chunks.length)return;if(selected.every((id,i)=>q.chunks[id]===q.chunks[i])){status().done=true;$('feedback').className='feedback success';$('feedback').textContent=(status().hints||status().grammarHints)?'잘 완성했어요! 다음에는 힌트 없이도 도전해 보세요.':'정답이에요! 문장의 흐름을 잘 연결했어요.';$('nextBtn').hidden=false;$('nextBtn').textContent=position===order.length-1?'학습 결과 보기':'다음 문장';$('checkBtn').hidden=true;$('hintBtn').disabled=true;}else{status().wrong=true;$('feedback').className='feedback error';$('feedback').textContent='아직 순서가 맞지 않아요. 주어와 동사의 위치부터 살펴보세요.';}draw();sidebar()};
$('nextBtn').onclick=()=>{if(position<order.length-1){position++;loadQuestion()}else showSummary()};
function showSummary(){$('exercise').hidden=true;$('summary').hidden=false;let done=order.filter(i=>states[i].done).length;let box=$('summary');box.replaceChildren();let icon=document.createElement('div');icon.className='summary-icon';icon.textContent='✦';let h=document.createElement('h2');h.textContent=done===order.length?'문장의 조각들이 연결됐어요!':'여기까지 잘했어요!';let p=document.createElement('p');p.textContent=`${order.length}개 중 ${done}개 문장을 완성했어요. 오답을 다시 풀며 문장의 구조를 익혀 보세요.`;box.append(icon,h,p);let retry=document.createElement('button');retry.className='primary';retry.textContent='전체 다시 연습';retry.onclick=()=>start(deck);box.append(retry);let wrong=document.createElement('button');wrong.className='secondary';wrong.textContent='오답 다시 풀기';wrong.disabled=!states.some(s=>s.wrong);wrong.onclick=review;box.append(wrong)}
function review(){let ids=states.flatMap((s,i)=>s.wrong?[i]:[]);if(!ids.length)return;reviewing=true;order=ids;position=0;ids.forEach(i=>{states[i]={done:false,wrong:false,hints:0}});loadQuestion();mode(false)}
function mode(teacher){$('teacherPanel').hidden=!teacher;$('studentPanel').hidden=teacher;$('teacherTab').classList.toggle('active',teacher);$('studentTab').classList.toggle('active',!teacher);$('teacherTab').setAttribute('aria-pressed',String(teacher));$('studentTab').setAttribute('aria-pressed',String(!teacher))}
$('reviewBtn').onclick=review;$('teacherTab').onclick=()=>mode(true);$('studentTab').onclick=()=>mode(false);$('deckSelect').onchange=e=>start(decks.find(d=>d.id===e.target.value));
$('teacherForm').onsubmit=e=>{e.preventDefault();let lines=$('sentences').value.trim().split(/\r?\n/).filter(s=>s.trim());let questions=lines.map(line=>{let at=line.indexOf('|');return{chunks:(at<0?line:line.slice(0,at)).split('/').map(s=>s.trim()),meaning:at<0?'':line.slice(at+1).trim()}});let d={id:'custom-'+Date.now(),title:$('deckTitle').value.trim(),questions};if(!validDeck(d)){$('formMessage').textContent='활동 이름과 문장을 확인해 주세요. 최대 50문장, 문장마다 / 로 나눈 2~20개 어구(각 200자 이하), 뜻은 500자 이하로 입력해 주세요.';return}decks.push(d);let saved=persist();$('formMessage').textContent=saved?'저장했습니다.':'브라우저 저장 공간이 부족합니다. 활동 파일로 내보내 보관해 주세요.';start(d);mode(false);if(!saved)$('feedback').textContent=$('formMessage').textContent;};
$('exportBtn').onclick=()=>{let blob=new Blob([JSON.stringify({title:deck.title,questions:deck.questions},null,2)],{type:'application/json'});let url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=deck.title.replace(/[\\/:*?"<>|]/g,'_')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('importFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{if(f.size>1000000)throw Error();let d=JSON.parse(await f.text());if(!validDeck(d))throw Error();d={id:'import-'+Date.now(),title:d.title,questions:d.questions.map(q=>({chunks:q.chunks.map(c=>c.trim()),meaning:q.meaning,...(hasLevels(d)?{easyChunks:q.easyChunks.map(c=>c.trim())}:{})}))};decks.push(d);let saved=persist();start(d);$('importMessage').textContent=saved?'활동을 가져왔어요. 학생 모드에서 시작하세요.':'가져왔지만 브라우저 저장에 실패했어요. 파일을 보관해 주세요.'}catch{$('importMessage').textContent='올바른 활동 JSON 파일인지 확인해 주세요. 파일 크기는 1MB 이하여야 합니다.'}e.target.value=''};
let grammarOpen=false;
function grammarForCurrent(){
  const sentence=normalize(current().chunks.join(' '));
  return GRAMMAR_NOTES.find(g=>normalize(g.sentence)===sentence);
}
function renderGrammar(){
  const info=grammarForCurrent(),panel=$('grammarPanel');
  $('grammarBtn').disabled=!info;
  $('grammarBtn').textContent=grammarOpen?'문장 성분 힌트 접기':'문장 성분 힌트';
  $('grammarBtn').setAttribute('aria-expanded',String(grammarOpen&&!!info));
  $('grammarAvailability').textContent=info?'펼치면 문장 전체의 구조가 공개됩니다.':'이 문장의 성분 힌트는 아직 준비되지 않았어요. 다음 어구 힌트를 이용하세요.';
  panel.hidden=!grammarOpen||!info;panel.replaceChildren();
  if(!grammarOpen||!info)return;
  const title=document.createElement('h3');title.textContent='문장의 구조 살펴보기';panel.append(title);
  for(const [role,phrase] of info.parts){
    const row=document.createElement('div');row.className='grammar-row '+(role.startsWith('주어')?'role-subject':role.startsWith('동사')?'role-verb':role.startsWith('목적어')?'role-object':role.startsWith('보어')?'role-complement':'role-modifier');
    const tag=document.createElement('strong');tag.textContent=role;
    const words=document.createElement('span');words.textContent=phrase;row.append(tag,words);panel.append(row);
  }
  const note=document.createElement('p');note.textContent=info.note;panel.append(note);
  const used=document.createElement('p');used.className='micro';used.textContent='성분 힌트 사용: '+(status().grammarHints||0)+'회 · 다음 어구 힌트와 별도로 기록합니다.';panel.append(used);
}
$('grammarBtn').onclick=()=>{if(!grammarForCurrent())return;grammarOpen=!grammarOpen;if(grammarOpen)status().grammarHints=(status().grammarHints||0)+1;renderGrammar()};
start(demo);mode(false);
