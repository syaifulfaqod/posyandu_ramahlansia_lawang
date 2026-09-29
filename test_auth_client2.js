const { createAuthClient } = require('better-auth/react');

const authClient1 = createAuthClient({
  baseURL: "http://localhost:8080" 
});

const authClient2 = createAuthClient({
  baseURL: "http://localhost:8080/api/auth" 
});

console.log("Client 1 baseURL:", authClient1.$store?.baseURL || authClient1.$context?.baseURL || authClient1.baseURL);
console.log("Client 2 baseURL:", authClient2.$store?.baseURL || authClient2.$context?.baseURL || authClient2.baseURL);
