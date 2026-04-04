import type { Theme } from "@models/tables";
import { useTheme } from "@providers/ThemeProvider";
import { FaLock } from "react-icons/fa";
import Tooltip from "./Tooltip";
import Ping from "./Ping";
import { twMerge } from "tailwind-merge";

type ThemeProps = {
  theme: Theme;
  locked?: boolean;
}

const ThemeItem = ({ theme, locked = false }: ThemeProps) => {
  const { currentTheme, setTheme, unusedThemeIds } = useTheme();
  const unused = unusedThemeIds.includes(theme.id);

  return (
    <Tooltip
      position="top"
      offset={10}
      text={theme.title}
      description={locked ? theme.description : undefined}
    >
      <div
        data-theme={theme.data_theme}
        className={twMerge(`
          rounded-2xl size-20 sm:size-25 relative group raise border-4`,
          locked ? "bg-base-bg/50 border-base-bg/0" : "bg-base-bg border-base-bg cursor-pointer",
          currentTheme === theme.data_theme && "border-4 border-neutral-50"
        )}
        onClick={locked ? undefined : () => setTheme(theme)}
      >
        <div className={twMerge(`
          bg-surface-primary rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-14 sm:size-17`,
          locked && "opacity-50"
        )}>
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
        <div data-theme={currentTheme}>
          <Ping
            show={unused}
            corner="topRight"
            size={16}
            offset={-8}
          />
        </div>
      </div>
    </Tooltip>
  );
}

export default ThemeItem;