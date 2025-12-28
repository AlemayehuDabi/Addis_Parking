import { useSession } from "@/lib/auth-client";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = useSession();
  console.log("session data: ", session)
  const location = useLocation();

  // 1. Show a loading state that matches your Midnight Aurora theme
  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          {/* A glowing spinner */}
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(150,100,255,0.5)]" />
          <p className="text-primary font-mono animate-pulse">SYNCING BIOMETRICS...</p>
        </div>
      </div>
    );
  }

  // 2. If no session exists, redirect to login
  if (!session) {
    // We save the 'from' location so we can redirect them back after they login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. If session exists, render the actual page
  return <>{children}</>;
};