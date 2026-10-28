import fs from 'node:fs/promises';
const url=new URL('../dist/data/cases.json',import.meta.url);
const cases=JSON.parse(await fs.readFile(url,'utf8'));
await fs.writeFile(new URL('../dist/data/cases.js',import.meta.url),'window.CLINICAL_CASES='+JSON.stringify(cases)+';\n');
console.log(`Подготовлено ${cases.length} кейсов`);
