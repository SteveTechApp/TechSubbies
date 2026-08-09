import fs from 'node:fs';
import path from 'node:path';

const target=path.resolve('data','techsubbies-e2e.db');
for(const suffix of ['', '-wal', '-shm']) fs.rmSync(`${target}${suffix}`,{force:true});
console.log(`Reset isolated E2E database: ${target}`);
