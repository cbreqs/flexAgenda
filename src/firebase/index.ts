'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

export type FirebaseServices = {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  error?: string;
};

export function initializeFirebase(): FirebaseServices {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  try {
    let app: FirebaseApp;
    const isPlaceholder = !firebaseConfig.apiKey || firebaseConfig.apiKey === "PASTE_YOUR_API_KEY_HERE";

    if (!getApps().length) {
      if (isPlaceholder) {
        // Return nulls gracefully instead of throwing to prevent white-screen-of-death
        return { firebaseApp: null, auth: null, firestore: null };
      }
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    return {
      firebaseApp: app,
      auth: getAuth(app),
      firestore: getFirestore(app)
    };
  } catch (err: any) {
    console.error("Firebase Initialization Error:", err.message);
    return { 
      firebaseApp: null, 
      auth: null, 
      firestore: null,
      error: err.code || err.message 
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
