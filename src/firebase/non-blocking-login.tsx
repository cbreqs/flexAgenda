'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. 
  // We handle the 'auth/configuration-not-found' error specifically as it's a common setup step.
  signInAnonymously(authInstance).catch((error) => {
    if (error.code === 'auth/configuration-not-found') {
      const projectId = authInstance.app.options.projectId;
      console.warn(
        `[FlexAgenda] Firebase Auth is not enabled. Please enable the 'Anonymous' provider at: https://console.firebase.google.com/project/${projectId}/authentication/providers`
      );
    } else {
      console.error("Firebase Anonymous Auth Error:", error.code, error.message);
    }
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch((error) => {
    console.error("Firebase SignUp Error:", error.code, error.message);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch((error) => {
    console.error("Firebase SignIn Error:", error.code, error.message);
  });
}
