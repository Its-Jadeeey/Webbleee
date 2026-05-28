import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

import { auth } from '../firebase';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
} from 'firebase/auth';

import { Platform } from 'react-native';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On web: session-only persistence — closing/refreshing tab requires re-login
    // On native: in-memory (no persistent session)
    const persistence =
      Platform.OS === 'web'
        ? browserSessionPersistence
        : inMemoryPersistence;

    setPersistence(auth, persistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return unsubscribe;
    });
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name, email, password) => {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credentials.user, { displayName: name });
    setUser({ ...credentials.user, displayName: name });
    return credentials.user;
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);