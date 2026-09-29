import { auth } from "./src/config/auth";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    console.log("Creating Ketua Kader user...");
    // 1. Create user via Better Auth (handles hashing and session tables)
    await auth.api.signUpEmail({
      body: {
        name: 'Ketua Kader',
        email: 'ketua.kader@posyandu.local',
        password: 'password123'
      }
    });
    console.log("User created, updating role...");
    
    // 2. Manually update the role field which is custom to our app
    const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL });
    await connection.execute("UPDATE user SET role = 'Ketua Kader' WHERE email = 'ketua.kader@posyandu.local'");
    await connection.end();
    
    console.log("Ketua Kader successfully created and seeded!");
  } catch (e) {
    console.error("Error seeding Ketua Kader:", e);
  }
}
seed();
