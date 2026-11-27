// Original practice sentences, not excerpts from a textbook or exam.
// Each row: medium chunks, easy chunks, Korean meaning, grammar parts, explanation.
const EXTRA_LESSONS = [
  {id:'school',title:'학교와 친구 · 함께 자라는 우리',shortTitle:'학교와 친구',questions:[
    [['A good friend','listens to','your ideas.'],['A good friend','listens to your ideas.'],'좋은 친구는 너의 생각에 귀를 기울인다.',[['주어 S','A good friend'],['동사 V','listens'],['전치사구','to your ideas.']],'listen 뒤에는 전치사 to가 필요합니다. your ideas는 전치사 to의 목적어입니다.'],
    [['Working together','makes','difficult tasks','easier.'],['Working together','makes difficult tasks easier.'],'함께 일하는 것은 어려운 과제를 더 쉽게 만든다.',[['주어 S','Working together'],['동사 V','makes'],['목적어 O','difficult tasks'],['목적격 보어','easier.']],'동명사구 Working together가 주어입니다. easier는 과제가 어떻게 되는지 설명하는 목적격 보어입니다.'],
    [['Our teacher','encourages us','to ask questions.'],['Our teacher','encourages us to ask questions.'],'우리 선생님은 우리가 질문하도록 격려하신다.',[['주어 S','Our teacher'],['동사 V','encourages'],['목적어 O','us'],['목적격 보어','to ask questions.']],'encourage + 목적어 + to부정사는 누군가가 어떤 행동을 하도록 격려한다는 뜻입니다.'],
    [['Students who help others','often build','strong friendships.'],['Students who help others','often build strong friendships.'],'다른 사람을 돕는 학생들은 흔히 돈독한 우정을 쌓는다.',[['주어 S','Students who help others'],['부사','often'],['동사 V','build'],['목적어 O','strong friendships.']],'who help others는 Students를 꾸미는 관계절입니다. 관계절 안에서는 who가 주어, help가 동사, others가 목적어입니다.'],
    [['Although we made mistakes,','we learned','something valuable.'],['Although we made mistakes,','we learned something valuable.'],'우리는 실수했지만 소중한 것을 배웠다.',[['양보 부사절','Although we made mistakes,'],['주어 S','we'],['동사 V','learned'],['목적어 O','something valuable.']],'Although는 비록 ~이지만이라는 뜻입니다. 앞 절의 주어는 we, 동사는 made, 목적어는 mistakes입니다. valuable은 something 뒤에서 꾸밉니다.']
  ]},
  {id:'planet',title:'환경과 선택 · 지구를 위한 한 걸음',shortTitle:'환경과 선택',questions:[
    [['Using a reusable bottle','reduces','plastic waste.'],['Using a reusable bottle','reduces plastic waste.'],'재사용할 수 있는 물병을 사용하는 것은 플라스틱 쓰레기를 줄인다.',[['주어 S','Using a reusable bottle'],['동사 V','reduces'],['목적어 O','plastic waste.']],'동명사구 전체가 하나의 활동을 나타내는 주어이므로 단수 동사 reduces를 사용합니다.'],
    [['We can save energy','by turning off','unused lights.'],['We can save energy','by turning off unused lights.'],'사용하지 않는 조명을 끄면 에너지를 절약할 수 있다.',[['주어 S','We'],['동사 V','can save'],['목적어 O','energy'],['부사구','by turning off unused lights.']],'by + 동명사는 방법을 나타냅니다. turn off는 끄다라는 뜻이고 unused는 lights를 꾸밉니다.'],
    [['The trees','that we plant today','will provide shade','in the future.'],['The trees that we plant today','will provide shade in the future.'],'우리가 오늘 심는 나무들은 미래에 그늘을 제공할 것이다.',[['주어 S','The trees that we plant today'],['동사 V','will provide'],['목적어 O','shade'],['부사구','in the future.']],'that we plant today는 trees를 꾸미는 관계절입니다. that은 관계절에서 plant의 목적어 역할을 합니다.'],
    [['If we waste less food,','we can protect','the environment.'],['If we waste less food,','we can protect the environment.'],'음식을 덜 낭비하면 환경을 보호할 수 있다.',[['조건 부사절','If we waste less food,'],['주어 S','we'],['동사 V','can protect'],['목적어 O','the environment.']],'If절은 조건을 나타냅니다. 그 안에서 we는 주어, waste는 동사, less food는 목적어입니다.'],
    [['Protecting nature','is','a responsibility','we all share.'],['Protecting nature','is a responsibility we all share.'],'자연을 보호하는 것은 우리 모두가 함께 지는 책임이다.',[['주어 S','Protecting nature'],['동사 V','is'],['보어 C','a responsibility we all share.']],'we all share는 responsibility를 꾸미며 목적격 관계대명사가 생략되어 있습니다. 주어가 무엇인지 설명하므로 is 뒤는 보어입니다.']
  ]},
  {id:'digital',title:'디지털 생활 · 생각하며 연결하기',shortTitle:'디지털 생활',questions:[
    [['We should check','the source','before sharing information.'],['We should check the source','before sharing information.'],'정보를 공유하기 전에 출처를 확인해야 한다.',[['주어 S','We'],['동사 V','should check'],['목적어 O','the source'],['부사구','before sharing information.']],'should는 ~해야 한다는 뜻의 조동사입니다. before 뒤의 동명사구는 정보를 공유하기 전이라는 시간을 나타냅니다.'],
    [['Taking regular breaks','helps us','stay focused.'],['Taking regular breaks','helps us stay focused.'],'규칙적으로 쉬는 것은 우리가 집중력을 유지하도록 돕는다.',[['주어 S','Taking regular breaks'],['동사 V','helps'],['목적어 O','us'],['목적격 보어','stay focused.']],'help 뒤에는 목적어와 동사원형을 쓸 수 있습니다. stay focused에서 focused는 집중한 상태를 설명합니다.'],
    [['Not everything','we read online','is','true.'],['Not everything we read online','is true.'],'우리가 온라인에서 읽는 모든 것이 사실인 것은 아니다.',[['주어 S','Not everything we read online'],['동사 V','is'],['보어 C','true.']],'not everything은 모든 것이 ~인 것은 아니라는 부분 부정입니다. we read online은 everything을 꾸미는 관계절입니다.'],
    [['The app','allows students','to practice','at their own pace.'],['The app allows students','to practice at their own pace.'],'그 앱은 학생들이 각자의 속도에 맞춰 연습할 수 있게 해 준다.',[['주어 S','The app'],['동사 V','allows'],['목적어 O','students'],['목적격 보어','to practice at their own pace.']],'allow + 목적어 + to부정사는 누군가가 어떤 행동을 할 수 있게 한다는 뜻입니다. at their own pace는 각자의 속도로라는 의미입니다.'],
    [['When we use technology wisely,','it can support','our learning.'],['When we use technology wisely,','it can support our learning.'],'우리가 기술을 현명하게 사용할 때 기술은 우리의 학습을 도울 수 있다.',[['시간·상황 부사절','When we use technology wisely,'],['주어 S','it'],['동사 V','can support'],['목적어 O','our learning.']],'When절 안에서 we는 주어, use는 동사, technology는 목적어이며 wisely는 use를 꾸밉니다. 주절의 it은 technology를 가리킵니다.']
  ]}
].map(lesson=>({...lesson,questions:lesson.questions.map(([chunks,easyChunks,meaning,parts,note])=>{
  GRAMMAR_NOTES.push({sentence:chunks.join(' '),parts,note});
  return {chunks,easyChunks,meaning};
})}));
