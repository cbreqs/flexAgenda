'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFirebase } from '@/firebase';

export function FirebaseErrorListener() {
  const [error, setError] = useState<{ message: string; path?: string } | null>(null);
  const { areServicesAvailable, firebaseApp } = useFirebase();

  useEffect(() => {
    if (!areServicesAvailable) {
      const config = firebaseApp?.options;
      const hasKey = config?.apiKey && config.apiKey !== "PASTE_YOUR_API_KEY_HERE";
      
      if (!hasKey) {
        setError({ 
          message: "Your Firebase Configuration is incomplete. Please paste your API Key from the Firebase Console into src/firebase/config.ts." 
        });
      }
    }
  }, [areServicesAvailable, firebaseApp]);

  useEffect(() => {
    const handleError = (permissionError: FirestorePermissionError) => {
      setError({
        message: "Missing or insufficient permissions. This usually means your Firestore Rules are blocking access or your Project ID is mismatched.",
        path: permissionError.request.path
      });
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] max-w-2xl mx-auto animate-in slide-in-from-bottom-4">
      <Alert variant="destructive" className="shadow-2xl bg-destructive text-destructive-foreground border-none p-6">
        <AlertCircle className="h-6 w-6 mt-1" />
        <div className="flex-1 ml-4">
          <AlertTitle className="text-lg font-bold">Firebase Setup Required</AlertTitle>
          <AlertDescription className="mt-3 space-y-4 text-sm opacity-90">
            <p>{error.message}</p>
            
            {error.path && <p className="font-mono bg-black/20 p-2 rounded text-xs">Path: {error.path}</p>}
            
            <div className="grid grid-cols-1 gap-2 pt-2">
              <a 
                href="https://console.firebase.google.com/project/reqs-tech/settings/general" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 underline font-bold"
              >
                1. Open Project Settings <ExternalLink className="w-4 h-4" />
              </a>
              <p>2. Copy your <strong>API Key</strong> from the {"Web apps"} section.</p>
              <p>3. Paste it into <strong>src/firebase/config.ts</strong>.</p>
              <p className="mt-2 text-xs opacity-75 italic">Note: If you already added the key, ensure Firestore Database is created in the Console.</p>
            </div>
          </AlertDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 text-white absolute top-4 right-4" 
          onClick={() => setError(null)}
        >
          <X className="w-5 h-5" />
        </Button>
      </Alert>
    </div>
  );
}
