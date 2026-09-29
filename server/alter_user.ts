import { db, connection } from "./src/db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Adding failedLoginAttempts and isLocked to user table...");
  try {
    await db.execute(sql`ALTER TABLE user ADD COLUMN failedLoginAttempts int DEFAULT 0 NOT NULL`);
  } catch(e) { console.log(e.message) }
  
  try {
    await db.execute(sql`ALTER TABLE user ADD COLUMN isLocked boolean DEFAULT false NOT NULL`);
  } catch(e) { console.log(e.message) }
  
  console.log("Done.");
  process.exit(0);
}

run();
