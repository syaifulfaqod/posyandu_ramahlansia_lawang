// @ts-nocheck
import { auth } from "./src/config/auth";

async function test() {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "kaderlia@posyandu.local",
        password: "12345",
        name: "kader lia",
      }
    });
    console.log("res:", res);
  } catch (err: any) {
    console.log("Error:", err.message, err.status, err.statusCode);
  }
  process.exit(0);
}

test();
