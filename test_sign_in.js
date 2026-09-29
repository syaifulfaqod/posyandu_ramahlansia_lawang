const { createAuthClient } = require('better-auth/react');

async function run() {
  const authClient1 = createAuthClient({ baseURL: "http://localhost:8080" });
  try {
    const { data, error } = await authClient1.signIn.email({ email: "x", password: "y" });
    console.log("Client 1 (http://localhost:8080) Error:", error);
  } catch (err) {
    console.log("Client 1 THREW:", err.message);
  }

  const authClient2 = createAuthClient({ baseURL: "http://localhost:8080/api/auth" });
  try {
    const { data, error } = await authClient2.signIn.email({ email: "x", password: "y" });
    console.log("Client 2 (http://localhost:8080/api/auth) Error:", error);
  } catch (err) {
    console.log("Client 2 THREW:", err.message);
  }
}
run();
