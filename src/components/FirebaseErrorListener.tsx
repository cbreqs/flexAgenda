'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { X, ExternalLink, ShieldAlert, Database } from "lucide-react";
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
          message: "Firebase configuration is missing or invalid. Please ensure your API Key is correctly pasted in src/firebase/config.ts." 
        });
      }
    } else {
      setError(null);
    }
  }, [areServicesAvailable, firebaseApp]);

  useEffect(() => {
    const handleError = (permissionError: FirestorePermissionError) => {
      setError({
        message: "Firestore Permission Denied. This almost always means the database hasn't been created yet in the console.",
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
          <AlertTitle className="text-lg font-bold uppercase tracking-tight">Backend Sync Required</AlertTitle>
          <AlertDescription className="mt-3 space-y-4 text-sm opacity-90 leading-relaxed">
            <p>{error.message}</p>
            
            {error.path && (
              <p className="font-mono bg-black/20 p-2 rounded text-[10px] break-all flex items-center gap-2">
                <Database className="w-3 h-3" /> {error.path}
              </p>
            )}
            
            <div className="space-y-3 pt-2 border-t border-white/20">
              <p className="font-bold underline underline-offset-4">Console Checklist:</p>
              <div className="space-y-2">
                <a 
                  href="https://console.firebase.google.com/project/reqs-tech/firestore" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 font-bold hover:text-white group bg-white/10 p-2 rounded-md"
                >
                  1. Open Firestore {'->'} Click "Create Database" <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </a>
                <p>2. Verify URL contains "/project/reqs-tech/"</p>
                <p>3. Ensure "Anonymous Auth" is enabled in the Auth tab.</p>
              </div>
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
