// AuthContext.jsx
// ---------------------------------------------------------------------------
// App-wide auth state via React Context. Wrap your app in <AuthProvider> once
// (e.g. in main.jsx), then call useAuth() from any component to read the
// current user or trigger auth actions.
// ---------------------------------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider, persistenceFor } from './firebaseConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function signIn(email, password, rememberMe = true) {
    await setPersistence(auth, persistenceFor(rememberMe));
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async function signUp(name, email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(credential.user, { displayName: name });
    }
    return credential.user;
  }

  async function signInWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  }

  async function signInWithApple() {
    const credential = await signInWithPopup(auth, appleProvider);
    return credential.user;
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  const value = {
    user,
    initializing,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
