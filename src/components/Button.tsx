import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  loadingMessage?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-button not-disabled:hover:bg-primary-button-hover text-primary-button-text',
  secondary: 'bg-secondary-button not-disabled:hover:bg-secondary-button-hover text-secondary-button-text',
  danger: 'bg-red-800 not-disabled:hover:bg-red-900 text-white',
  success: 'bg-green-600 not-disabled:hover:bg-green-700 text-white'
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  type = "button",
  loading,
  loadingMessage = "Loading...",
  disabled,
  onClick,
  variant = "primary",
  className,
}, ref) => (
  <button
    ref={ref}
    type={type}
    disabled={loading || disabled}
    className={twMerge(`
      inline-flex items-center justify-center
      px-2.5 py-1.5 text-sm font-medium border border-transparent select-none
      rounded-lg transition-colors duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-default`,
      variantStyles[variant],
      className
    )}
    onClick={onClick}
  >
    {loading ? loadingMessage : children}
  </button>
));

export default Button;
