// @ts-nocheck
import { db } from './src/db';
import { account, user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function test() {
  const users = await db.query.user.findMany();
  for (const u of users) {
    const acc = await db.query.account.findFirst({ where: eq(account.userId, u.id) });
    console.log(`User: ${u.email} | Has Account: ${!!acc} | Has Password: ${!!acc?.password}`);
  }
  process.exit(0);
}
test();
