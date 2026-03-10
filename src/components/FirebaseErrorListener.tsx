'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It surfaces errors to the developer overlay while avoiding infinite reload loops.
 */
export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Log the error for debugging in the browser console.
      console.warn("Firestore Permission Denied:", error.request.path, error.request.method);
      setError(error);
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // We only throw the error once per trigger to avoid Fast Refresh loops.
  // This will show the Next.js error overlay with the specific rule that failed.
  if (error) {
    const errToThrow = error;
    // Clearing state immediately allows the next error to be caught without a loop
    // but the throw still triggers the overlay.
    return (
      <div className="hidden">
        {(() => { throw errToThrow; })()}
      </div>
    );
  }

  return null;
}
