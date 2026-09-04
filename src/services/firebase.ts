import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfigRaw from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (firebaseConfigRaw && firebaseConfigRaw.apiKey) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfigRaw);
    // Note: Use firestoreDatabaseId if specified
    const dbId = (firebaseConfigRaw as { firestoreDatabaseId?: string }).firestoreDatabaseId;
    db = dbId ? getFirestore(app, dbId) : getFirestore(app);
    auth = getAuth(app);
  }
} catch (err) {
  console.warn('Firebase initialization notice:', err);
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

/**
 * Sends a password reset email to the user via Firebase Auth
 */
export async function sendAccountPasswordResetEmail(email: string): Promise<PasswordResetResponse> {
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    return {
      success: false,
      message: 'Please provide an email address to receive the password reset link.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address format (e.g., name@domain.com).',
    };
  }

  if (!auth) {
    return {
      success: false,
      message: 'Firebase Authentication service is not initialized. Please verify configuration.',
    };
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return {
      success: true,
      message: `Password reset email sent to ${cleanEmail}. Please check your inbox and spam folders for instructions to reset your password.`,
    };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const code = err?.code || '';
    let message = 'Unable to send password reset email at this time. Please try again.';

    if (code === 'auth/user-not-found') {
      message = 'No account was found with this email address. Please check for typos or contact your administrator.';
    } else if (code === 'auth/invalid-email') {
      message: 'The email address provided is not valid.';
    } else if (code === 'auth/too-many-requests') {
      message = 'Too many password reset attempts have been made. Please wait a few minutes before trying again.';
    } else if (code === 'auth/network-request-failed') {
      message = 'A network error occurred. Please check your internet connection and try again.';
    } else if (code === 'auth/operation-not-allowed') {
      message = 'Email password reset is not currently enabled on this Firebase project. Please ensure Email/Password is enabled in the Firebase Console.';
    } else if (err?.message) {
      message = err.message;
    }

    return {
      success: false,
      message,
    };
  }
}

export { app, db, auth };
