import { eq } from "drizzle-orm";
import { db } from "./src/db";
import { user } from "./src/db/schema";
import { UserService } from "./src/services/user.service";

async function main() {
  const username = "kkn_ramahlansia";
  const password = "tahap1kknterbaik";
  const name = "KKN RAMAH LANSIA";
  const email = `${username}@posyandu.local`;
  
  // check if already exists
  const existing = await db.query.user.findFirst({
    where: eq(user.email, email)
  });
  
  if (existing) {
    console.log("KKN account already exists!");
    return;
  }
  
  try {
    const data = {
      nama: name,
      username: username,
      password: password,
      role: "Admin",
      isPermanent: true
    };
    
    await UserService.createUser(data);
    console.log("KKN account created successfully!");
  } catch (error) {
    console.error("Error creating KKN account:", error);
  }
}

main().catch(console.error);
