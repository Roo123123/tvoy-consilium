import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {acceptedAnswers,isCorrect} from '../dist/game-core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cases=JSON.parse(await fs.readFile(path.join(root,'dist/data/cases.json'),'utf8'));
if(cases.length!==50||new Set(cases.map(c=>c.id)).size!==50||new Set(cases.map(c=>c.diagnosis)).size!==50)throw Error('Требуются 50 уникальных задач');
for(const c of cases){if(c.clues.length!==6||c.clues.some(s=>typeof s!=='string'||!s.trim()))throw Error(`Подсказки: ${c.id}`);for(const key of ['diagnosis','explanation','differential','nuance','source1'])if(!c[key])throw Error(`${c.id}: нет ${key}`);if(!isCorrect(c,c.diagnosis)||!acceptedAnswers(c).length)throw Error('Нет ключа ответа');for(const u of [c.source1,c.source2].filter(Boolean))if(new URL(u).protocol!=='https:')throw Error('Некорректная ссылка');}
const generated=await fs.readFile(path.join(root,'dist/data/cases.js'),'utf8');
if(generated!=='window.CLINICAL_CASES='+JSON.stringify(cases)+';\n')throw Error('Запустите npm run prepare-data: cases.js отличается от cases.json');
const themes=await fs.readFile(path.join(root,'dist/themes.js'),'utf8');
if((themes.match(/id:'/g)||[]).length!==10)throw Error('Ожидалось 10 концепций');
for(const name of ['index.html','play.html','consilium.html','consilium.css','concepts.html','legacy-play.html','favicon.svg','app.css','app.mjs','studio.css','studio.js','icons.js'])await fs.access(path.join(root,'dist',name));
console.log('50 кейсов, 300 подсказок, 10 концепций. Структура, ответы, ссылки и синхронизация данных проверены.');
