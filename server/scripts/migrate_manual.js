const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' });

async function migrate() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL
  });
  
  try {
    console.log('Adding keteranganMeninggal to lansia...');
    // In MySQL, ADD COLUMN IF NOT EXISTS requires complicated workarounds or just ignoring errors
    // Simple ADD COLUMN for demonstration, assuming the user can handle errors if it exists.
    try {
      await connection.query(`ALTER TABLE lansia ADD COLUMN keteranganMeninggal TEXT;`);
    } catch (e) {
      if(e.code !== 'ER_DUP_FIELDNAME') throw e;
    }
    console.log('Done.');
  } catch (e) {
    console.log('Error adding column:', e.message);
  }

  try {
    console.log('Creating galeri table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS galeri (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        imageUrl TEXT NOT NULL,
        authorId TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log('Done.');
  } catch (e) {
    console.log('Error creating table:', e.message);
  }
  
  try {
    console.log('Adding foreign key to galeri...');
    // Note: In MySQL, authorId needs to be VARCHAR for FK index to work properly with user id if it's text, 
    // better-auth user id is usually varchar(255) or similar.
    // If it fails, manual intervention might be needed based on actual better-auth user table schema.
    await connection.query(`
      ALTER TABLE galeri ADD CONSTRAINT galeri_authorId_user_id_fk FOREIGN KEY (authorId(255)) REFERENCES user(id(255)) ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
    console.log('Done.');
  } catch (e) {
    console.log('Error adding fk:', e.message);
  }

  await connection.end();
}

migrate();
