import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

type ThemeContextType = {
  currentTheme: Themes | null
  setTheme: (theme: Themes) => void;
}

export const lightThemes = ["light-brand"] as const;
export const darkThemes = ["dark-brand"] as const;
const allThemes = [...lightThemes, ...darkThemes] as const;
export type Themes = typeof allThemes[number];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<Themes | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      if (!user) return;
      const { data, error } = await supabase.from('profiles')
        .select()
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.log("Error retrieving theme: ", error);
        throw new Error("Error retrieving theme: ", error);
      }

      const loadedTheme = (data?.theme || localStorage.getItem("theme") || "light-brand") as Themes;
      setCurrentTheme(loadedTheme);
    }

    loadTheme();
  }, [user])

  useEffect(() => {
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem("theme", currentTheme);
    }
  }, [currentTheme]);

  const setTheme = async (theme: Themes) => {
    setCurrentTheme(theme);

    if (user) {
      const { error } = await supabase.from('profiles')
        .update({ theme })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error setting theme: ", error);
        toast.error("Could not set your theme, please try again later.");
      }
    }

    localStorage.setItem("theme", theme);
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <div data-theme={currentTheme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}