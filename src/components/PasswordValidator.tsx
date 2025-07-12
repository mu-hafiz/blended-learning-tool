import { TiTickOutline, TiTimesOutline } from "react-icons/ti";

type PasswordValidatorProps = {
  boolValue: boolean;
  message: string;
}

const PasswordValidator = ({boolValue, message}: PasswordValidatorProps) => (
  <div className="flex flex-row items-center">
    {boolValue
      ? <TiTickOutline fontSize={32} className="text-success" />
      : <TiTimesOutline fontSize={32} className="text-error" />}
    <p>{message}</p>
  </div>
);

export default PasswordValidator;