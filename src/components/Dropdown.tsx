import { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

type DropdownProps = {
  placeholder?: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  containerClassName?: string;
}

type DropdownItemProps = {
  value: string;
  onChange: (value: string) => void;
}

const DropdownItem = ({ value, onChange }: DropdownItemProps) => (
  <div
    className="w-full px-2.5 py-1.5 bg-secondary-button hover:bg-secondary-button-hover cursor-pointer flex"
    onClick={() => onChange(value)}
  >
    <p className="truncate min-w-0">{value}</p>
  </div>
);

const Dropdown = ({ placeholder, options, value, onChange, disabled = false, containerClassName }: DropdownProps) => {
  const [clicked, setClicked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setClicked(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <div className={twMerge("relative inline-block", containerClassName)} ref={dropdownRef}>
      <div
        className={
          `
            px-2.5 py-1.5 flex gap-2 justify-between items-center text-sm min-w-30 bg-secondary-button font-medium rounded-lg hover:cursor-pointer
            ${clicked && "rounded-b-none"}
          `
        }
        onPointerDown={disabled ? undefined : () => setClicked(!clicked)}
      >
        <p>{value ?? placeholder}</p>
        <FaCaretDown />
      </div>
      {clicked &&
        <div className="inline-block min-w-full max-h-40 absolute overflow-y-auto overscroll-none rounded-b-lg z-50 shadow-lg border sm:border-2 border-surface-tertiary">
          {options.map(option => (
            <DropdownItem
              key={option}
              value={option}
              onChange={(option) => {
                onChange(option);
                setClicked(false);
              }}
            />
          ))}
        </div>
      }
    </div>
  )
};

export default Dropdown;