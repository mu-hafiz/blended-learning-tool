import { useEffect } from "react";
import { useTheme } from "@providers/ThemeProvider";
import ThemeItem from "@components/ThemeItem";
import { useOutletContext } from "react-router-dom";
import { type OnboardingOutletContext } from "../types/stateTypes";

const OnboardingPreferences = () => {
  const { lightThemes, darkThemes, unlockedThemeIds } = useTheme();
  const { buttonClicked, setButtonClicked, goToNextStep } = useOutletContext<OnboardingOutletContext>();

  useEffect(() => {
    if (!buttonClicked) return;
    setButtonClicked(false);
    goToNextStep();
  }, [buttonClicked]);

  return (
    <div>
      <h2>Themes</h2>
      <p className="subtitle">Choose the perfect theme for you!</p>
      <p className="subtitle">As you progress, you will unlock more themes to use.</p>
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


export default OnboardingPreferences;