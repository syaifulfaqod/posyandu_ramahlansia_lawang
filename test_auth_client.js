const { createAuthClient } = require('better-auth/react');

// Simulate Next.js env
const authClient = createAuthClient({
  baseURL: "http://localhost:8080/api/auth" 
});

console.log("Client created.");
console.dir(authClient.signIn, { depth: null });
