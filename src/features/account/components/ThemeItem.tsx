import { type Themes } from "@providers/ThemeProvider";
import { useTheme } from "@providers/ThemeProvider";

const ThemeItem = ({ dataTheme }: { dataTheme: Themes }) => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div
      data-theme={dataTheme}
      className={`bg-base rounded-2xl w-30 h-30 relative cursor-pointer raise ${currentTheme === dataTheme && "border-4 border-neutral-50"}`}
      onClick={() => setTheme(dataTheme)}
    >
      <div className="bg-surface-primary rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-22 h-22">
        <div className="bg-surface-secondary rounded-md absolute top-3 left-1/2 -translate-x-1/2 w-16 h-7"/>
        <div className="bg-surface-tertiary rounded-md absolute top-12 left-1/2 -translate-x-1/2 w-16 h-7"/>
      </div>
    </div>
  );
}

export default ThemeItem;