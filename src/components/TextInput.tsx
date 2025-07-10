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

const TextInput = ({ type, title, value, placeholder, onChange, required = true, multiline, className }: TextInputProps) => (
  <div className="flex flex-col flex-1 gap-2">
    <h3 className="text-left">{title}</h3>
    {!multiline ? (
      <input
        type={type}
        placeholder={placeholder}
        className={`p-3 bg-input text-primary-text rounded-xl placeholder:text-placeholder ${className}`}
        onChange={onChange}
        required={required}
        {...(value !== undefined ? { value } : {})}
      />
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
);

export default TextInput;