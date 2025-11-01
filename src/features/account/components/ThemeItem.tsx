import type { Theme } from "@models/tables";
import { useTheme } from "@providers/ThemeProvider";
import { FaLock } from "react-icons/fa";

const ThemeItem = ({ theme, locked = false }: { theme: Theme, locked?: boolean }) => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div
      data-theme={theme.data_theme}
      className={`rounded-2xl w-30 h-30 relative group raise ${currentTheme === theme.data_theme && "border-4 border-neutral-50"} ${locked ? "bg-base/50" : "bg-base cursor-pointer"}`}
      onClick={locked ? undefined : () => setTheme(theme)}
    >
      <div className={`bg-surface-primary rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-22 h-22 ${locked && "opacity-50"}`}>
        <div className="bg-surface-secondary rounded-md absolute top-3 left-1/2 -translate-x-1/2 w-16 h-7"/>
        <div className="bg-surface-tertiary rounded-md absolute top-12 left-1/2 -translate-x-1/2 w-16 h-7"/>
      </div>
      { locked && (
        <>
          <FaLock
            className="relative w-10 h-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
            color="red"
          />
        </>
      )}
      <div
        data-theme={currentTheme}
        className="absolute p-2 flex flex-col gap-1 text-center bottom-10/12 left-1/2 -translate-x-1/2 bg-surface-secondary rounded-lg opacity-0 group-hover:opacity-100 transition duration-500 z-10 pointer-events-none"
      >
        <h3 className="text-primary-text">
          {theme.title}
        </h3>
        { locked && (
          <>
            <div className="bg-surface-tertiary h-0.25 w-full"/>
            <span className="text-secondary-text"> {theme.unlock_criteria} </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ThemeItem;