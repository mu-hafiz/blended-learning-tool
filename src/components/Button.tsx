import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

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
  danger: 'bg-red-900 not-disabled:hover:bg-red-700 text-white',
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
    className={`
      px-5 py-2.5 font-medium border border-transparent
      rounded-lg transition duration-250 cursor-pointer
      disabled:opacity-50 disabled:cursor-default
      ${variantStyles[variant]} ${className}
    `}
    onClick={onClick}
  >
    {loading ? loadingMessage : children}
  </button>
));

export default Button;
