import { auth } from "./src/config/auth";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    console.log("Creating Admin user...");
    // 1. Create user via Better Auth
    await auth.api.signUpEmail({
      body: {
        name: 'Administrator',
        email: 'admin@posyandu.local',
        password: 'adminpassword'
      }
    });
    console.log("User created, updating role to Admin...");
    
    // 2. Manually update the role field
    const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });
    await connection.execute("UPDATE user SET role = 'Admin', isPermanent = 1 WHERE email = 'admin@posyandu.local'");
    await connection.end();
    
    console.log("Admin successfully created and seeded!");
  } catch (e: any) {
    if (e?.body?.message?.includes('already exists') || String(e).includes('already exists')) {
      console.log("Admin account already exists! Trying to reset role and password just in case.");
      const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });
      await connection.execute("UPDATE user SET role = 'Admin', isPermanent = 1 WHERE email = 'admin@posyandu.local'");
      await connection.end();
      console.log("Updated existing Admin account role.");
    } else {
      console.error("Error seeding Admin:", e);
    }
  }
}
seed();
