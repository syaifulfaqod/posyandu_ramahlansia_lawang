import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, 'src', '.env') });
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/posyandu';

async function main() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to database.");

    await client.query(`
      ALTER TABLE "pemeriksaan" 
      ADD COLUMN IF NOT EXISTS "lingkarPerut" numeric(5, 2),
      ADD COLUMN IF NOT EXISTS "lingkarLengan" numeric(5, 2);
    `);
    
    console.log("Successfully added lingkarPerut and lingkarLengan to pemeriksaan table.");

  } catch (error) {
    console.error("Error updating schema:", error);
  } finally {
    await client.end();
  }
}

main();
