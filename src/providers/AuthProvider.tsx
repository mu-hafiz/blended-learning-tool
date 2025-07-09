import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";

import type { User } from "@supabase/supabase-js";
type SignUpInfo = {
  email: string,
  password: string,
};
type AuthContextType = {
  user: User | null | undefined;
  signUp: ({ email, password }: SignUpInfo) => Promise<{ success: boolean; error?: any }>;
  login: (info: SignUpInfo) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // We use 'undefined' as the 'loading' state
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // When session is retrieved, if user is not logged in...
      // ...it will be undefined, but since we use undefined as the 'loading state'...
      // ...we set the user to null instead
      setUser(session?.user === undefined ? null : session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user === undefined ? null : session.user);
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
    <AuthContext.Provider value={{ user, signUp, login, signOut }}>
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