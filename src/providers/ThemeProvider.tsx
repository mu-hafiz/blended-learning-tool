import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { toast } from "@lib/toast";
import type { Theme } from "@models/tables";

type ThemeContextType = {
  currentTheme: string | null
  lightThemes: Theme[];
  darkThemes: Theme[];
  unlockedThemeIds: string[];
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [lightThemes, setLightThemes] = useState<Theme[]>([]);
  const [darkThemes, setDarkThemes] = useState<Theme[]>([]);
  const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>([]);

  useEffect(() => {
    const loadAllThemes = async () => {
      const { data, error } = await supabase.from('themes').select();
      if (error) {
        console.log("Error getting all themes: ", error);
        throw new Error("Error getting all themes: ", error);
      }

      const light = data.filter(theme => theme.type === 'light');
      const dark = data.filter(theme => theme.type === 'dark');

      setLightThemes(light);
      setDarkThemes(dark);
    }

    loadAllThemes();
  }, [])

  useEffect(() => {
    const loadUserTheme = async () => {
      if (!user) return;
      const { data, error } = await supabase.from('users')
        .select('theme_id(data_theme)')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.log("Error getting user's selected theme: ", error);
        throw new Error("Error getting user's selected theme: ", error);
      }

      const loadedTheme = data?.theme_id?.data_theme || localStorage.getItem("theme") || "light-brand";
      setCurrentTheme(loadedTheme);
    }

    const getUserUnlockedThemes = async () => {
      if (!user) return;
      const { data, error } = await supabase.from('unlocked_themes')
        .select('theme_id(*)')
        .eq('user_id', user.id);
      
      if (error) {
        console.log("Error getting user's unlocked themes: ", error);
        throw new Error("Error getting user's unlocked themes: ", error);
      }

      setUnlockedThemeIds(data.map(item => item.theme_id.id));
    }

    loadUserTheme();
    getUserUnlockedThemes();
  }, [user])

  useEffect(() => {
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem("theme", currentTheme);
    }
  }, [currentTheme]);

  const setTheme = async (theme: Theme) => {
    setCurrentTheme(theme.data_theme);

    if (user) {
      const { error } = await supabase.from('users')
        .update({ theme_id: theme.id })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error setting theme: ", error);
        toast.error("Could not set your theme, please try again later.");
      }
    }

    localStorage.setItem("theme", theme.data_theme);
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, lightThemes, darkThemes, unlockedThemeIds, setTheme}}>
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