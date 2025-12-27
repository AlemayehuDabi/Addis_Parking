import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // The URL of your NestJS backend
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Export hooks for easy use in components
export const { useSession, signIn, signUp, signOut } = authClient;