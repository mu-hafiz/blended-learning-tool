import type { Theme } from "@models/tables";
import { useTheme } from "@providers/ThemeProvider";
import { FaLock } from "react-icons/fa";
import Tooltip from "./Tooltip";

const ThemeItem = ({ theme, locked = false }: { theme: Theme, locked?: boolean }) => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <Tooltip
      position="top"
      offset={10}
      text={theme.title}
      description={locked ? theme.description : undefined}
    >
      <div
        data-theme={theme.data_theme}
        className={`rounded-2xl size-20 sm:size-25 relative group raise ${currentTheme === theme.data_theme && "border-4 border-neutral-50"} ${locked ? "bg-base-bg/50" : "bg-base-bg cursor-pointer"}`}
        onClick={locked ? undefined : () => setTheme(theme)}
      >
        <div className={`bg-surface-primary rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-14 sm:size-17 ${locked && "opacity-50"}`}>
          <div className="bg-surface-secondary rounded-md absolute sm:top-2.5 top-2 left-1/2 -translate-x-1/2 w-9 h-4 sm:w-12 sm:h-5"/>
          <div className="bg-surface-tertiary rounded-md absolute sm:top-9.5 top-8 left-1/2 -translate-x-1/2 w-9 h-4 sm:w-12 sm:h-5"/>
        </div>
        { locked && (
          <>
            <FaLock
              className="relative size-7 sm:size-10 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
              color="red"
            />
          </>
        )}
      </div>
    </Tooltip>
  );
}

export default ThemeItem;