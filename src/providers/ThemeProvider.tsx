import { createContext, useState, useContext, useEffect } from "react";

type ThemeContextType = {
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("theme") || "light-brand"
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ setCurrentTheme }}>
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