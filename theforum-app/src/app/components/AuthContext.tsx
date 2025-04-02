// src/app/components/AuthContext.tsx
"use client"; // Needed for Firebase authentication in Next.js

import { createContext, useContext, useEffect, useState, ReactNode } from "react"; //import createContext, useContext, useEffect, useState, and ReactNode
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType { //create AuthContextType interface
  user: User | null; //user property of type User or null
  signInWithGoogle: () => Promise<void>; //signInWithGoogle function that returns a promise
  signOutUser: () => Promise<void>; //signOutUser function that returns a promise
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); //create AuthContext with AuthContextType interface

export const AuthProvider = ({ children }: { children: ReactNode }) => { //create AuthProvider component
  const [user, setUser] = useState<User | null>(null); //create user state variable; init to null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { //listen for auth state changes
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => { //create signInWithGoogle function
    try {
      await signInWithPopup(auth, googleProvider); //sign in with Google
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    //provide user, signInWithGoogle, and signOutUser to children
    <AuthContext.Provider value={{ user, signInWithGoogle, signOutUser }}> 
      {children} 
    </AuthContext.Provider> 
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext); //use context to access AuthContext
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};