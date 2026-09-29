import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('DATA LANSIA KEL. LAWANG 0926.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
console.log('Headers:');
console.log(data[0]);
console.log(data[1]);
console.log(data[2]);

console.log('Sample rows:');
for (let i = 3; i < 7; i++) {
  console.log(data[i]);
}
