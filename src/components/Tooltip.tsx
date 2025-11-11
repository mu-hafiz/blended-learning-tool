type TooltipProps = {
  text: string;
  children: React.ReactNode;
  position: 'top' | 'bottom';
  offset?: number;
  disabled?: boolean;
}

const Tooltip = ({ text, children, position, offset, disabled=false }: TooltipProps) => {
  if (disabled) return <>{children}</>
  return (
    <div className="relative flex items-center justify-center group align-middle">
      {children}
      <h3
        className={`
          absolute left-1/2 -translate-x-1/2
          bg-surface-secondary text-primary-text text-sm text-center
          rounded-lg px-2 py-1
          opacity-0 group-hover:opacity-100
          transition-all duration-300 z-10 pointer-events-none
        `}
        style={{
          [position === 'bottom' ? 'top' : 'bottom']: `calc(100% + ${offset ?? 0}px)`
        }}
      >
        {text}
      </h3>
    </div>
  )
};

export default Tooltip;

// ${position ? position : "top"}-[calc(100% + ${offset}px)]