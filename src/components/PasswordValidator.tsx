import { TiTickOutline, TiTimesOutline } from "react-icons/ti";

type PasswordValidatorProps = {
  boolValue: boolean;
  message: string;
}

const PasswordValidator = ({boolValue, message}: PasswordValidatorProps) => (
  <div className="flex flex-row items-center">
    {boolValue
      ? <TiTickOutline className="text-success size-7 sm:size-8" />
      : <TiTimesOutline className="text-error size-7 sm:size-8" />}
    <p>{message}</p>
  </div>
);

export default PasswordValidator;