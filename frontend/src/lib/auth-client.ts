import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // The URL of your NestJS backend
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:3000",
     basePath: "/api/auth",
    fetchOptions: {
        credentials: "include", // This forces the browser to send cookies
    },
});

// Export hooks for easy use in components
export const { useSession, signIn, signUp, signOut } = authClient;