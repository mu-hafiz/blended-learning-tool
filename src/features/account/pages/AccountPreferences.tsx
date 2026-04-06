import { useTheme } from "@providers/ThemeProvider";
import ThemeItem from "@components/ThemeItem";
import type { Theme } from "@models/tables";
import { useMemo } from "react";

const AccountPreferences = () => {
  const { lightThemes, darkThemes, unlockedThemeIds } = useTheme();

  const sortThemes = (themes: Theme[]) => {
    return [...themes].sort((a, b) => {
      const aUnlocked = unlockedThemeIds.includes(a.id);
      const bUnlocked = unlockedThemeIds.includes(b.id);
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return a.unlock_type.localeCompare(b.unlock_type) || a.title.localeCompare(b.title);
    });
  };

  const sortedLightThemes = useMemo(() => sortThemes(lightThemes), [lightThemes, unlockedThemeIds]);
  const sortedDarkThemes = useMemo(() => sortThemes(darkThemes), [darkThemes, unlockedThemeIds]);

  return (
    <>
      <h2>Themes</h2>
      <p className="subtitle">Choose the perfect theme for you!</p>
      <hr className="divider"/>
      <h3 className="mb-3">Light Mode</h3>
      <div className="flex flex-wrap gap-3">
        {sortedLightThemes.map((theme, idx) => {
          const isLocked = !unlockedThemeIds.includes(theme.id);
          return <ThemeItem key={idx} theme={theme} locked={isLocked}/>
        })}
      </div>
      <h3 className="mt-5 mb-3">Dark Mode</h3>
      <div className="flex flex-wrap gap-3">
        {sortedDarkThemes.map((theme, idx) => {
          const isLocked = !unlockedThemeIds.includes(theme.id);
          return <ThemeItem key={idx} theme={theme} locked={isLocked}/>
        })}
      </div>
    </>
  );
};

export default AccountPreferences;