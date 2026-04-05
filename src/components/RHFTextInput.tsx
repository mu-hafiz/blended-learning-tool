import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import TextInput from "./TextInput";
import { twMerge } from "tailwind-merge";

type RHFTextInputProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  title: string;
  description?: string;
  placeholder?: string;
  type?: "email" | "password";
  required?: boolean;
  multiline?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  maxLength?: number;
  textAreaClassName?: string;
}

function RHFTextInput<T extends FieldValues = FieldValues>({
  name,
  control,
  containerClassName,
  ...rest
}: RHFTextInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={twMerge("flex flex-col gap-1", containerClassName)}>
          <TextInput {...field} {...rest} rhfMode={true} />
          {fieldState.error && (
            <p className="text-left text-error-text">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default RHFTextInput;