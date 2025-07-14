import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import TextInput from "./TextInput";

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
}

function RHFTextInput<T extends FieldValues = FieldValues>({
  name,
  control,
  ...rest
}: RHFTextInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1 flex-1">
          <TextInput {...field} {...rest} rhfMode={true} />
          {fieldState.error && (
            <p className="text-left text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}

export default RHFTextInput;