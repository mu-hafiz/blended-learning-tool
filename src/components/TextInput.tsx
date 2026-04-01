import { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  title?: string;
  description?: string;
  value?: string;
  placeholder?: string;
  type?: "email" | "password";
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  className?: string;
  rhfMode?: boolean;
  containerClassName?: string;
  disabled?: boolean;
  maxLength?: number;
}

const TextInput = ({
  type,
  title,
  description,
  value,
  placeholder,
  onChange,
  required = true,
  multiline,
  className,
  rhfMode,
  containerClassName,
  disabled,
  maxLength
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className={twMerge("flex flex-col w-full", containerClassName)}>
      <div className="flex flex-row items-center">
        {title && <h3 className="text-left">{title}</h3>}
        {!required && title && <p className="text-secondary-text ml-1">(optional)</p>}
        {required && title && <p className="text-error-text ml-1">*</p>}
      </div>
      {description && <p className="text-secondary-text">{description}</p>}
      {!multiline ? (
        <div className={twMerge("relative", title ? "mt-1.5" : "", className)}>
          <input
            type={inputType}
            placeholder={placeholder}
            className={`w-full p-2 h-10 bg-input text-sm text-primary-text rounded-lg placeholder:text-placeholder`}
            onChange={onChange}
            required={required && !rhfMode}
            value={value ?? ""}
            disabled={disabled}
            maxLength={maxLength}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <RiEyeLine size={25}/> : <RiEyeCloseLine size={25} />}
            </button>
          )}
        </div>
      ) : (
        <textarea
          placeholder={placeholder}
          className={twMerge(`
            mt-1.5 p-3 bg-input text-sm text-primary-text rounded-lg placeholder:text-placeholder`,
            className
          )}
          onChange={onChange}
          required={required && !rhfMode}
          value={value ?? ""}
          disabled={disabled}
        />
      )}
    </div>
  )
};

export default TextInput;