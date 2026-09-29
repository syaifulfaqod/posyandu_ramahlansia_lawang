// @ts-nocheck
import { db } from './src/db';
async function test() {
  const users = await db.query.user.findMany();
  console.log(users.map(u => ({ email: u.email, role: u.role })));
  process.exit(0);
}
test();
