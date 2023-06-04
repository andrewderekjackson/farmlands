import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import * as path from 'path';

import {readFileSync, writeFileSync, renameSync, readdirSync, statSync } from 'fs';

const processFile = (file:string) => {
  const originalFile = path.join(__dirname, '../data', file);
  const processedFile = path.join(__dirname, '../data/processed', file);
  const historyFile = path.join(__dirname, '../data/history', file);

  const content = readFileSync(originalFile);

  const newTx: Array<Record<string, string>> = [];
  
  content.toString().split('\n').forEach((line:string) => {
    var records = parse(line, {columns: false});

    records.forEach((rec:Array<string>) => {

      if (rec[3] === 'Transactions') {
        const tx = {
          Date: rec[7],
          Payee: rec[19],
          Desciption: rec[12],
          Memo: rec[18],
          Amount: rec[17],
        }
        newTx.push(tx);
      }

      if (rec[3] ==='Payments' && rec[12]==='*Payment*') {
        // rec.forEach((r:string,i:number) => console.log(`${i}: ${r}`));

        const tx = {
          Date: rec[7],
          Payee: 'Farmlands',
          Desciption: rec[12],
          Memo: '',
          Amount: rec[15],
        }
        newTx.push(tx);
      }

     })
  
  });
  
  // save processed CSV file
  const txCsv = stringify(newTx, {header: true});
  writeFileSync(processedFile, txCsv);

  // move original file to history
  renameSync(originalFile, historyFile);
}

readdirSync(path.join(__dirname, '../data')).forEach(file => {
  const s = statSync(path.join(__dirname, '../data', file));
  if (!s.isDirectory() && path.extname(file) === '.csv') {
    console.log(`Processing file: ${file}`);
    processFile(file);
  }
})











