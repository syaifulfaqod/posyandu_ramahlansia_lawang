const { createAuthClient } = require('better-auth/react');

async function run() {
  const authClient = createAuthClient({ baseURL: "/api/auth" });
  try {
    const { data, error } = await authClient.signIn.email({ email: "x", password: "y" });
    console.log("Error:", error);
  } catch (err) {
    console.log("THREW:", err.message);
  }
}
run();
