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
  primary: 'bg-neutral-300 hover:bg-neutral-400 text-black',
  secondary: 'bg-black hover:border-neutral-300 text-white',
  danger: 'bg-red-900 hover:bg-red-700 text-white',
};

const Button = ({
  children,
  type,
  loading,
  loadingMessage = "Loading...",
  disabled,
  onClick,
  variant = "primary",
  className
}: ButtonProps) => (
  <button
    type={type}
    disabled={loading || disabled}
    className={`
      px-5 py-2.5 font-medium border border-transparent
      rounded-lg disabled:opacity-50 transition duration-250 cursor-pointer
      ${variantStyles[variant]} ${className}
    `}
    onClick={onClick}
  >
    {loading ? loadingMessage : children}
  </button>
);

export default Button;
