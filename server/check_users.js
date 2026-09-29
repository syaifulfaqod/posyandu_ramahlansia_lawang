const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:admin200423@localhost:5433/posyandu_db' });
async function check() {
  await client.connect();
  const res = await client.query('SELECT name, email, role FROM "user"');
  console.log(res.rows);
  await client.end();
}
check();
