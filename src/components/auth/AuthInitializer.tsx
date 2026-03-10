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
    const apiKey = auth?.app?.options?.apiKey;
    const isKeySet = apiKey && apiKey !== "PASTE_YOUR_API_KEY_HERE";
    
    if (
      !isUserLoading && 
      !user && 
      auth && 
      isKeySet
    ) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return null;
}
