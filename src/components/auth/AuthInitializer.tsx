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
    // Only attempt sign-in if we have a valid auth instance and an actual API key is present
    const apiKey = auth?.app?.options?.apiKey;
    
    if (
      !isUserLoading && 
      !user && 
      auth && 
      apiKey && 
      apiKey !== "YOUR_API_KEY_HERE" &&
      !apiKey.startsWith("AIzaSyAdIKiCeoh") // Check if it's still the placeholder/default
    ) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return null;
}
