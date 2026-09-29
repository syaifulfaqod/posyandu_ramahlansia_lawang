import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { user, account, session } from "../db/schema";
import { auth } from "../config/auth";
// @ts-ignore
import { hashPassword } from "@better-auth/utils/password";

export class UserService {
  static async getAllUsers() {
    const records = await db.select().from(user).orderBy(desc(user.createdAt));
    
    return records.map(u => ({
      ...u,
      nama: u.name,
      username: u.email.split('@')[0],
      lastLogin: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Belum pernah login'
    }));
  }

  static async createUser(data: any) {
    const email = `${data.username}@posyandu.local`;

    // 1. Create user via BetterAuth to handle password hashing and ID generation safely
    const res = await auth.api.signUpEmail({
      body: {
        email: email,
        password: data.password,
        name: data.nama,
      }
    });
    
    // 2. Update custom fields (role, kelurahan, rw)
    if (res?.user?.id) {
       await db.update(user).set({
         role: data.role,
         kelurahan: data.kelurahan || null,
         rw: data.rw || null,
         isPermanent: data.isPermanent || false,
       }).where(eq(user.id, res.user.id));
       const [updated] = await db.select().from(user).where(eq(user.id, res.user.id));
       return { ...res.user, ...updated };
    }
    
    throw new Error("Failed to create user");
  }

  static async updateUser(id: string, data: any) {
    const [targetUser] = await db.select().from(user).where(eq(user.id, id));
    if (!targetUser) throw new Error("User not found");

    const email = `${data.username}@posyandu.local`;

    // 1. Update user fields
    await db.update(user).set({
      name: data.nama,
      email: email,
      role: data.role,
      kelurahan: data.kelurahan || null,
      rw: data.rw || null,
    }).where(eq(user.id, id));
    const [updatedUser] = await db.select().from(user).where(eq(user.id, id));

    // 2. Update password if provided
    if (data.password && data.password.trim() !== '') {
      const hashedPassword = await hashPassword(data.password);
      await db.update(account).set({
        password: hashedPassword
      }).where(eq(account.userId, id));
    }

    return { ...updatedUser, nama: updatedUser.name, username: updatedUser.email.split('@')[0] };
  }

  static async deleteUser(id: string) {
    // Check if permanent
    const [targetUser] = await db.select().from(user).where(eq(user.id, id));
    if (!targetUser) throw new Error("User not found");
    if (targetUser.isPermanent) throw new Error("Cannot delete permanent admin");

    // Delete related better-auth records first to avoid FK violations
    await db.delete(account).where(eq(account.userId, id));
    await db.delete(session).where(eq(session.userId, id));
    
    // Delete the user record
    await db.delete(user).where(eq(user.id, id));
    return { success: true };
  }
}
