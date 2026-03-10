
"use client";

import { useEffect } from "react";
import { useAuth, initiateAnonymousSignIn } from "@/firebase";
import { useUser } from "@/firebase";

/**
 * AuthInitializer ensures that every visitor has a Firebase identity.
 * It initiates an anonymous sign-in if no user is currently authenticated.
 */
export function AuthInitializer() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return null;
}
