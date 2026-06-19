// firebaseConfig.js
// ---------------------------------------------------------------------------
// Initializes Firebase and exports the Auth instance + OAuth providers used
// throughout the app. Values come from environment variables — never commit
// real keys to source control.
//
// Setup (Firebase Console → console.firebase.google.com):
//   1. Create a project.
//   2. Project settings → General → add a Web app → copy the config values
//      below into your .env file (see .env.example).
//   3. Authentication → Sign-in method → enable "Email/Password", "Google",
//      and "Apple".
//   4. Authentication → Settings → Authorized domains → add your production
//      domain (localhost is allowed by default for development).
//   5. For Apple Sign-In specifically, you also need an Apple Developer
//      account to configure a Services ID + Sign in with Apple key — Firebase
//      walks you through this under the Apple provider setup screen.
// ---------------------------------------------------------------------------

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Helper used by AuthContext to honor the "Remember me" checkbox.
export const persistenceFor = (rememberMe) =>
  rememberMe ? browserLocalPersistence : browserSessionPersistence;
