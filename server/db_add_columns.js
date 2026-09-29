const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'posyandu_db'
  });

  const alterTableQuery = `
    ALTER TABLE pemeriksaan
    ADD COLUMN skilasKognitifOrientasi TINYINT(1),
    ADD COLUMN skilasKognitifMengulang TINYINT(1),
    ADD COLUMN skilasMobilisasiBerdiri TINYINT(1),
    ADD COLUMN skilasNutrisiBbturun TINYINT(1),
    ADD COLUMN skilasNutrisiNafsumakan TINYINT(1),
    ADD COLUMN skilasNutrisiLila TINYINT(1),
    ADD COLUMN skilasMataMasalah TINYINT(1),
    ADD COLUMN skilasMataTes TINYINT(1),
    ADD COLUMN skilasTelingaBisik TINYINT(1),
    ADD COLUMN skilasTelingaTes TINYINT(1),
    ADD COLUMN skilasDepresiSedih TINYINT(1),
    ADD COLUMN skilasDepresiMinat TINYINT(1),
    ADD COLUMN skilasCovid TINYINT(1),
    
    ADD COLUMN aksBAB INT,
    ADD COLUMN aksBAK INT,
    ADD COLUMN aksGrooming INT,
    ADD COLUMN aksToilet INT,
    ADD COLUMN aksMakan INT,
    ADD COLUMN aksTransfer INT,
    ADD COLUMN aksMobilitas INT,
    ADD COLUMN aksBerpakaian INT,
    ADD COLUMN aksTangga INT,
    ADD COLUMN aksMandi INT,

    ADD COLUMN pumaMerokok INT,
    ADD COLUMN pumaNapasPendek INT,
    ADD COLUMN pumaDahak INT,
    ADD COLUMN pumaBatuk INT,
    ADD COLUMN pumaSpirometri INT,

    ADD COLUMN tbcBatuk TINYINT(1),
    ADD COLUMN tbcDemam TINYINT(1),
    ADD COLUMN tbcBbTurun TINYINT(1),
    ADD COLUMN tbcKontak TINYINT(1),
    ADD COLUMN kontrasepsi TINYINT(1),
    ADD COLUMN kontrasepsiJenis VARCHAR(50);
  `;

  try {
    await connection.query(alterTableQuery);
    console.log("Columns added successfully.");
  } catch (err) {
    console.error("Error adding columns:", err.message);
  } finally {
    await connection.end();
  }
}

main();
