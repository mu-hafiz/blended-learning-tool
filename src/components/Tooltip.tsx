import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type TooltipProps = {
  text: string;
  description?: string;
  children: React.ReactNode;
  position: 'top' | 'bottom';
  offset?: number;
  disabled?: boolean;
  className?: string;
}

const Tooltip = ({ text, children, position, offset = 5, disabled=false, description, className }: TooltipProps) => {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (disabled) return <>{children}</>
  
  return (
    <div
      ref={containerRef}
      className="relative inline-block align-middle group"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => {
        if (!show) {
          setShow(true)
        }
      }}
    >
      {children}
      <div
        className={twMerge(`
          absolute left-1/2 -translate-x-1/2
          bg-surface-secondary text-primary-text text-center
          border-2 border-surface-tertiary
          rounded-lg px-2 py-1
          transition-all duration-300 z-10 pointer-events-none
          whitespace-normal w-max max-w-80`,
          show ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1",
          className
        )}
        style={{
          [position === 'bottom' ? 'top' : 'bottom']: `calc(100% + ${offset ?? 0}px)`
        }}
      >
        <p className="font-bold">{text}</p>
        {description && <p className="subtitle line-clamp-2">{description}</p>}
      </div>
    </div>
  )
};

export default Tooltip;

// ${position ? position : "top"}-[calc(100% + ${offset}px)]