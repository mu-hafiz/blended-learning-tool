import { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

type TextInputProps = {
  title: string;
  description?: string;
  value?: string;
  placeholder?: string;
  type?: "email" | "password";
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  className?: string;
  rhfMode?: boolean;
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
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row">
        <h3 className="text-left">{title}</h3>
        {!required && <p className="text-secondary-text ml-1">(optional)</p>}
      </div>
      {description && <p className="text-secondary-text">{description}</p>}
      {!multiline ? (
        <div className="relative mt-1.5">
          <input
            type={inputType}
            placeholder={placeholder}
            className={`w-full p-3 h-12 bg-input text-primary-text rounded-xl placeholder:text-placeholder ${className}`}
            onChange={onChange}
            required={required && !rhfMode}
            value={value ?? ""}
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
          className={`mt-1.5 p-3 bg-input text-primary-text rounded-xl placeholder:text-placeholder ${className}`}
          onChange={onChange}
          required={required && !rhfMode}
          value={value ?? ""}
        />
      )}
    </div>
  )
};

export default TextInput;