import { useTheme } from "@providers/ThemeProvider";
import ThemeItem from "../components/ThemeItem";

const AccountPreferences = () => {
  const { lightThemes, darkThemes, unlockedThemeIds } = useTheme();
  return (
    <form className="m-2 mt-4">
      <h2>Themes</h2>
      <p className="text-secondary-text">Choose the perfect theme for you!</p>
      <hr className="border-surface-secondary my-3"/>
      <h2 className="mb-3">Light Mode</h2>
      <div className="flex gap-3">
        {lightThemes.map((theme) => {
          const isLocked = unlockedThemeIds.includes(theme.id);
          return <ThemeItem theme={theme} locked={isLocked}/>
        })}
      </div>
      <h2 className="mt-5 mb-3">Dark Mode</h2>
      <div className="flex gap-3">
        {darkThemes.map((theme) => {
          const isLocked = unlockedThemeIds.includes(theme.id);
          return <ThemeItem theme={theme} locked={isLocked}/>
        })}
      </div>
    </form>
  );
};

export default AccountPreferences;