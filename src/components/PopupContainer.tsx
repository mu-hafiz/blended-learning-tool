import type { ReactNode } from "react";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PopupContainer = ({ open, onClose, children }: PopupProps) => {
  return (
    <div
      className={`
        fixed z-50 inset-0 flex items-center justify-center
        bg-black/40 transition duration-500
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`
      }
      onClick={onClose}
    >
      <div
        className="bg-surface-primary rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default PopupContainer;