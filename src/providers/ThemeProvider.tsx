import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { toast } from "@lib/toast";
import type { Theme } from "@models/tables";
import usersDB from "@lib/db/users";
import unlockedThemesDB from "@lib/db/unlockedThemes";
import themesDB from "@lib/db/themes";
import { tryCatch } from "@utils/tryCatch";

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
      const { data: themes, error } = await tryCatch(themesDB.getThemes());
      if (error) {
        toast.error("Could not load themes");
        return;
      }
      const light = themes.filter(theme => theme.type === 'light');
      const dark = themes.filter(theme => theme.type === 'dark');
      setLightThemes(light);
      setDarkThemes(dark);
    }

    loadAllThemes();
  }, [])

  useEffect(() => {
    if (!user) return;

    const loadUserTheme = async () => {
      const { data: dataTheme, error } = await tryCatch(usersDB.getUserTheme(user!.id));
      if (error) {
        toast.error("Could not load your theme");
        return;
      }
      const loadedTheme = dataTheme || localStorage.getItem("theme") || "light-brand";
      setCurrentTheme(loadedTheme);
    }

    const getUserUnlockedThemes = async () => {
      const { data: themes, error } = await tryCatch(unlockedThemesDB.getUserUnlockedThemes(user.id));
      if (error) {
        toast.error("Could not load your unlocked themes");
        return;
      }
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
      const { error } = await tryCatch(usersDB.setUserTheme(user.id, theme.id));
      if (error) {
        toast.error("Could not set your theme, please try again later");
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