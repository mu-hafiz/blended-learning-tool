type TextInputProps = {
  title: string;
  placeholder?: string;
  type?: "email" | "password";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const TextInput = ({ type, title, placeholder, onChange, required = true }: TextInputProps) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-left">{title}</h3>
    <input
      type={type}
      placeholder={placeholder}
      className="p-3 bg-input text-primary-text rounded-xl placeholder:text-placeholder"
      onChange={onChange}
      required={required}
    />
  </div>
);

export default TextInput;