import { lightThemes, darkThemes } from "@providers/ThemeProvider";
import ThemeItem from "../components/ThemeItem";

const AccountPreferences = () => {
  return (
    <form className="m-2 mt-4">
      <h2>Themes</h2>
      <p className="text-secondary-text">Choose the perfect theme for you!</p>
      <hr className="border-surface-secondary my-3"/>
      <h2 className="mb-3">Light Mode</h2>
      {lightThemes.map((item) => <ThemeItem dataTheme={item} />)}
      <h2 className="mt-5 mb-3">Dark Mode</h2>
      {darkThemes.map((item) => <ThemeItem dataTheme={item} />)}
    </form>
  );
};

export default AccountPreferences;