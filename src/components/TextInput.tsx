type TextInputProps = {
  title: string;
  placeholder?: string;
  type?: "email" | "password";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({ type, title, placeholder, onChange }: TextInputProps) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-left">{title}</h3>
    <input
      type={type}
      placeholder={placeholder}
      className="p-3 bg-neutral-900 rounded-xl"
      onChange={onChange}
    />
  </div>
);

export default TextInput;