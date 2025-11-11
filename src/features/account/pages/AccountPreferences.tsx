import { useTheme } from "@providers/ThemeProvider";
import ThemeItem from "../components/ThemeItem";

const AccountPreferences = () => {
  const { lightThemes, darkThemes, unlockedThemeIds } = useTheme();
  return (
    <div className="m-2 mt-4">
      <h2>Themes</h2>
      <p className="subtitle">Choose the perfect theme for you!</p>
      <hr className="my-3"/>
      <h3 className="mb-3">Light Mode</h3>
      <div className="flex gap-3">
        {lightThemes.map((theme, idx) => {
          const isLocked = !unlockedThemeIds.includes(theme.id);
          return <ThemeItem key={idx} theme={theme} locked={isLocked}/>
        })}
      </div>
      <h3 className="mt-5 mb-3">Dark Mode</h3>
      <div className="flex gap-3">
        {darkThemes.map((theme, idx) => {
          const isLocked = !unlockedThemeIds.includes(theme.id);
          return <ThemeItem key={idx} theme={theme} locked={isLocked}/>
        })}
      </div>
    </div>
  );
};

export default AccountPreferences;