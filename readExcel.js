const xlsx = require('xlsx');

const workbook = xlsx.readFile('KARTU BANTU LANSIA.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Output first 5 rows to understand structure
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
console.log(JSON.stringify(data.slice(0, 20), null, 2));
