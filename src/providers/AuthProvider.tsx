import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";

import type { Session } from "@supabase/supabase-js";
type SignUpInfo = {
  email: string,
  password: string,
};
type AuthContextType = {
  session: Session | null | undefined;
  signUp: ({ email, password }: SignUpInfo) => Promise<{ success: boolean; error?: any }>;
  login: (info: SignUpInfo) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password }: SignUpInfo) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    return { success: true };
  }

  const login = async ({ email, password }: SignUpInfo) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error signing in: ', error);
      return { success: false, error };
    }

    return { success: true };
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out: ", error);
      return { success: false, error };
    }

    return { success: true };
  }

  return (
    <AuthContext.Provider value={{ session, signUp, login, signOut }}>
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