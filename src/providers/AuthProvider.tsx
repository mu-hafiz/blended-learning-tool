import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";
import { AuthError } from "@supabase/supabase-js";

import { FunctionsHttpError, type User } from "@supabase/supabase-js";
import type { UserPrivacySettings } from "@models/tables";
type SignUpInfo = {
  email: string,
  password: string,
};
type FinishOnboardingInfo = {
  username: string,
  firstName: string,
  middleName?: string,
  lastName: string,
  aboutMe?: string,
}
type SignUpResult =
  | { success: true; error?: undefined; }
  | { success: false; error: AuthError; };

type AuthContextType = {
  user: User | null | undefined;
  signUp: ({ email, password }: SignUpInfo) => Promise<SignUpResult>;
  finishOnboarding: (formValues: FinishOnboardingInfo, privacySettings: UserPrivacySettings) => Promise<{ success: boolean; error?: any }>;
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

  const signUp = async ({ email, password }: SignUpInfo): Promise<SignUpResult> => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Sign up failed:", {
        message: error.message,
        status: error.status,
        name: error.name,
      });
      return { success: false, error };
    }

    return { success: true };
  }

  const finishOnboarding = async (formValues: FinishOnboardingInfo, privacySettings: UserPrivacySettings) => {
    const { error } = await supabase.functions.invoke("finish-onboarding", {
      body: {
        userId: user!.id,
        formValues,
        privacySettings
      }
    });

    if (error instanceof FunctionsHttpError) {
      console.log("Error updating onboarding status: ", error);
      const errorMessage = await error.context.json();
      return { success: false, error: errorMessage.error };
    }

    // Refresh the user's session so app_metadata updates
    await supabase.auth.refreshSession();

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
    <AuthContext.Provider value={{ user, signUp, finishOnboarding, login, signOut }}>
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