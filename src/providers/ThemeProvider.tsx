import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import { toast } from "@lib/toast";
import type { Theme } from "@models/tables";
import usersDB from "@lib/db/users";
import unlockedThemesDB from "@lib/db/unlockedThemes";
import themesDB from "@lib/db/themes";

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
      const themes = await themesDB.getThemes();
      const light = themes.filter(theme => theme.type === 'light');
      const dark = themes.filter(theme => theme.type === 'dark');
      setLightThemes(light);
      setDarkThemes(dark);
    }

    loadAllThemes();
  }, [])

  useEffect(() => {
    const loadUserTheme = async () => {
      if (!user) return;
      const dataTheme = await usersDB.getUserTheme(user.id);
      const loadedTheme = dataTheme || localStorage.getItem("theme") || "light-brand";
      setCurrentTheme(loadedTheme);
    }

    const getUserUnlockedThemes = async () => {
      if (!user) return;
      const themes = await unlockedThemesDB.getUserUnlockedThemes(user.id);
      setUnlockedThemeIds(themes.map(item => item.theme_id.id));
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
      const success = await usersDB.setUserTheme(user.id, theme.id);
      if (!success) {
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