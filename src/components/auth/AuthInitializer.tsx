"use client";

import { useEffect } from "react";
import { useAuth, initiateAnonymousSignIn, useUser } from "@/firebase";

/**
 * AuthInitializer ensures that every visitor has a Firebase identity.
 * It initiates an anonymous sign-in if no user is currently authenticated.
 */
export function AuthInitializer() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Only attempt sign-in if we have a valid auth instance (requires API Key)
    if (!isUserLoading && !user && auth && auth.config.apiKey !== "YOUR_API_KEY_HERE") {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return null;
}
