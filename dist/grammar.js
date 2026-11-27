// Curated explanations for the original five sample sentences (lessons.js adds 15); no automatic parsing.
// Labels describe phrases/clauses, not the part of speech of each word.
const GRAMMAR_NOTES = [
  {
    sentence:'Small actions can make a big difference.',
    parts:[['주어 S','Small actions'],['동사 V','can make'],['목적어 O','a big difference.']],
    note:'Small은 actions를 꾸미는 말입니다. can은 조동사로 make와 함께 동사 부분을 이룹니다. a big difference는 make의 목적어입니다.'
  },
  {
    sentence:'Technology has changed the way we live.',
    parts:[['주어 S','Technology'],['동사 V','has changed'],['목적어 O','the way we live.']],
    note:'has changed는 현재완료 동사입니다. 목적어 전체는 the way we live이며, we live는 어떤 방식인지 설명합니다. 그 안에서 we는 주어, live는 동사입니다.'
  },
  {
    sentence:'What matters most is not the result but the effort.',
    parts:[['주어 S','What matters most'],['동사 V','is'],['보어 C','not the result but the effort.']],
    note:'What matters most라는 명사절 전체가 주어입니다. 절 안에서는 What이 주어, matters가 동사, most가 부사입니다. 주절의 is 뒤에는 주어가 무엇인지 설명하는 보어가 오며, not A but B는 A가 아니라 B라는 뜻입니다.'
  },
  {
    sentence:'By listening to others, we can learn to see the world from different perspectives.',
    parts:[['부사구','By listening to others,'],['주어 S','we'],['동사 V','can learn'],['to부정사구','to see the world from different perspectives.']],
    note:'By listening to others는 방법을 나타냅니다. to부정사구는 무엇을 배우는지 설명합니다. 그 안에서 see의 목적어는 the world이고, from different perspectives는 바라보는 관점을 나타냅니다. 이 문장 전체를 단순히 S·V·O 세 조각으로 나누지는 않습니다.'
  },
  {
    sentence:'The more we practice, the more confident we become.',
    parts:[['앞 절 · 부사','The more'],['주어 S · 앞 절','we'],['동사 V · 앞 절','practice,'],['보어 C · 뒤 절','the more confident'],['주어 S · 뒤 절','we'],['동사 V · 뒤 절','become.']],
    note:'the + 비교급 …, the + 비교급 …는 ~할수록 더 …하다는 구문입니다. 앞 절의 more는 practice의 정도를 나타냅니다. 뒤 절은 we become confident가 기본 구조이며, 비교 표현 the more confident가 절 앞으로 나옵니다. confident는 목적어가 아니라 주어 we의 상태를 설명하는 보어입니다.'
  }
];
