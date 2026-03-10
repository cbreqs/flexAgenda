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
    // Attempt sign-in if core services are ready and an API key is present.
    // We've removed the restrictive prefix check to allow sign-in attempts
    // as soon as a project is targeted.
    const apiKey = auth?.app?.options?.apiKey;
    
    if (
      !isUserLoading && 
      !user && 
      auth && 
      apiKey && 
      apiKey !== "YOUR_API_KEY_HERE"
    ) {
      console.log("AuthInitializer: Initiating anonymous sign-in...");
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return null;
}
