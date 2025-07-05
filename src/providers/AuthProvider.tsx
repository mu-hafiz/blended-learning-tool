import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";

import type { Session } from "@supabase/supabase-js";
type SignUpInfo = {
  email: string,
  password: string,
};
type AuthContextType = {
  session: Session | null;
  signUp: ({ email, password }: SignUpInfo) => Promise<{ success: boolean; data?: any; error?: any }>;
  signIn: (info: SignUpInfo) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })
  }, [])

  const signUp = async ({ email, password }: SignUpInfo) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error }
    }

    return { success: true, data }
  }

  const signIn = async ({ email, password }: SignUpInfo) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error signing in: ', error);
      return { success: false, error };
    }

    return { success: true, data };
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}