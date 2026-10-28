export const STORAGE_KEY='case-club.progress.v1';
export function normalize(s){return String(s).toLowerCase().replace(/ё/g,'е').replace(/[acekmoptxybh]/g,c=>({a:'а',c:'с',e:'е',k:'к',m:'м',o:'о',p:'р',t:'т',x:'х',y:'у',b:'в',h:'н'}[c])).replace(/[^\p{L}\p{N}]+/gu,'');}
export function acceptedAnswers(c){return [c.diagnosis,...c.aliases.split(';').map(s=>s.split(' — ')[0].trim())].filter(Boolean).map(normalize);}
export function isCorrect(c,s){return acceptedAnswers(c).includes(normalize(s));}
export function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function dayNumber(key){return Math.floor(Date.parse(key+'T12:00:00Z')/86400000);}
export function currentStreak(days,today=dayKey()){const nums=new Set(days.map(dayNumber));let n=dayNumber(today);if(!nums.has(n))n--;let count=0;while(nums.has(n)){count++;n--;}return count;}
export function longestStreak(days){const a=[...new Set(days.map(dayNumber))].sort((a,b)=>a-b);let max=0,run=0,last=-Infinity;for(const n of a){run=n===last+1?run+1:1;max=Math.max(max,run);last=n;}return max;}
export function score(clues,misses){return Math.max(20,100-(clues-1)*12-misses*5);}
export function initialState(){return {version:1,solved:{},days:[],xp:0,review:{},sessions:{},reviewWins:0};}
export function readState(raw){try{const s=JSON.parse(raw);if(s?.version!==1||!s.solved||!Array.isArray(s.days))return initialState();return {...initialState(),...s};}catch{return initialState();}}
export function recordSolve(s,c,{clues,misses,today=dayKey()}){const first=!s.solved[c.id];const review=Boolean(s.review[c.id]);let reward=0;if(first){reward=score(clues,misses);s.solved[c.id]={date:today,clues,misses,score:reward,difficulty:c.difficulty,specialty:c.specialty};s.xp+=reward;}if(review){s.reviewWins++;delete s.review[c.id];}if(!s.days.includes(today))s.days.push(today);return {first,reward,review};}
export function addReview(s,id,today=dayKey()){const next=new Date((dayNumber(today)+1)*86400000);s.review[id]=next.toISOString().slice(0,10);}
export const BADGES=[
 {id:'first',name:'Первый диагноз',desc:'Решить первый кейс',icon:'spark'},
 {id:'early',name:'Схватил суть',desc:'Верный ответ за две подсказки',icon:'target'},
 {id:'three',name:'Вошёл в ритм',desc:'Практиковаться три дня подряд',icon:'flame'},
 {id:'week',name:'Неделя в форме',desc:'Практиковаться семь дней подряд',icon:'calendar'},
 {id:'ten',name:'Десятка',desc:'Решить десять разных кейсов',icon:'award'},
 {id:'expert',name:'Сложный случай',desc:'Решить кейс сложности 5',icon:'diamond'},
 {id:'wide',name:'Широкий взгляд',desc:'Решить кейсы из пяти направлений',icon:'compass'},
 {id:'clean',name:'Точное попадание',desc:'Решить за три подсказки без ошибок',icon:'check'},
 {id:'return',name:'Разобрался',desc:'Вернуться и решить три кейса из повторения',icon:'repeat'},
 {id:'all',name:'Весь атлас',desc:'Решить все 50 разных кейсов',icon:'book'}
];
export function earnedBadges(s){const a=Object.values(s.solved),st=longestStreak(s.days),fields=new Set(a.map(x=>x.specialty.split('/')[0].trim()));const tests={first:a.length>=1,early:a.some(x=>x.clues<=2),three:st>=3,week:st>=7,ten:a.length>=10,expert:a.some(x=>x.difficulty===5),wide:fields.size>=5,clean:a.some(x=>x.clues<=3&&x.misses===0),return:s.reviewWins>=3,all:a.length>=50};return BADGES.filter(b=>tests[b.id]).map(b=>b.id);}
