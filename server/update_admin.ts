import { db } from "./src/db";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function updateUsername() {
  try {
    console.log("Updating username (email)...");
    
    // Find the user with name "KKN RAMAH LANSIA" or old email
    const [adminUser] = await db.select().from(user).where(eq(user.email, 'admin@posyandu.local'));
    
    if (!adminUser) {
      console.error("Admin user not found! Maybe it was already updated.");
      process.exit(1);
    }
    
    // Update email
    const newEmail = 'kknramahlansia@posyandu.local';
    await db.update(user).set({ email: newEmail }).where(eq(user.id, adminUser.id));
    
    console.log(`Username successfully updated to 'kknramahlansia' (Email: ${newEmail})`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating username:", error);
    process.exit(1);
  }
}

updateUsername();
