import { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

type TextInputProps = {
  title: string;
  value?: string;
  placeholder?: string;
  type?: "email" | "password";
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  className?: string;
}

const TextInput = ({ type, title, value, placeholder, onChange, required = true, multiline, className }: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col flex-1 gap-1.5 relative">
      <div className="flex flex-row">
        <h3 className="text-left">{title}</h3>
        {!required && <p className="text-secondary-text ml-1">(optional)</p>}
      </div>
      {!multiline ? (
        <>
          <input
            type={inputType}
            placeholder={placeholder}
            className={`p-3 h-12 bg-input text-primary-text rounded-xl placeholder:text-placeholder ${className}`}
            onChange={onChange}
            required={required}
            {...(value !== undefined ? { value } : {})}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 cursor-pointer"
            >
              {showPassword ? <RiEyeCloseLine size={25} /> : <RiEyeLine size={25}/>}
            </button>
          )}
        </>
      ) : (
        <textarea
          placeholder={placeholder}
          className={`p-3 bg-input text-primary-text rounded-xl placeholder:text-placeholder ${className}`}
          onChange={onChange}
          required={required}
          {...(value !== undefined ? { value } : {})}
        />
      )}
    </div>
  )
};

export default TextInput;