import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  sizeClassName?: string;
}

const PopupContainer = ({ open, onClose, children, sizeClassName = "h-120" }: PopupProps) => {
  return (
    <div
      className={twMerge(`
        fixed z-50 inset-0 flex items-center justify-center
        bg-black/40 transition duration-500 p-5`,
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div
        className={twMerge(
          "bg-surface-primary rounded-2xl p-8 flex flex-col w-full sm:size-120",
          sizeClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default PopupContainer;