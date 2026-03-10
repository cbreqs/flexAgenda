'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, ExternalLink, ShieldAlert } from "lucide-react";
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
          message: "Firebase configuration is missing or invalid. Please add your API Key to src/firebase/config.ts." 
        });
      }
    } else {
      // Clear configuration errors once services are available
      setError(null);
    }
  }, [areServicesAvailable, firebaseApp]);

  useEffect(() => {
    const handleError = (permissionError: FirestorePermissionError) => {
      setError({
        message: "Permission denied. Ensure your Firestore Database is created and rules are set to public for prototyping.",
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
    <div className="fixed bottom-6 left-6 right-6 z-[100] max-w-xl animate-in slide-in-from-bottom-4">
      <Alert variant="destructive" className="shadow-2xl bg-destructive text-destructive-foreground border-none p-6">
        <ShieldAlert className="h-6 w-6 mt-1" />
        <div className="flex-1 ml-4">
          <AlertTitle className="text-lg font-bold">Firebase Connection Issue</AlertTitle>
          <AlertDescription className="mt-3 space-y-4 text-sm opacity-90 leading-relaxed">
            <p>{error.message}</p>
            
            {error.path && (
              <p className="font-mono bg-black/20 p-2 rounded text-xs break-all">
                Path: {error.path}
              </p>
            )}
            
            <div className="space-y-2 pt-2">
              <p className="font-bold border-b border-white/20 pb-1 mb-2">How to fix this:</p>
              <a 
                href="https://console.firebase.google.com/project/reqs-tech/settings/general" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 underline font-bold hover:text-white"
              >
                1. Open Firebase Console Settings <ExternalLink className="w-4 h-4" />
              </a>
              <p>2. Verify Project ID &quot;reqs-tech&quot; matches your URL.</p>
              <p>3. Go to Firestore Database and click &quot;Create Database&quot;.</p>
              <p className="text-xs italic opacity-80 mt-2">The app will automatically refresh and turn &quot;Live&quot; once these steps are completed.</p>
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
