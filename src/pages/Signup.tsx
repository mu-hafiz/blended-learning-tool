import { useState } from "react";
import { useAuth } from "@providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput } from "@components";
import { toast } from "sonner";
import { TiTickOutline } from "react-icons/ti";
import { TiTimesOutline } from "react-icons/ti";

type PasswordValidatorProps = {
  boolValue: boolean;
  message: string;
};

const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lengthCheck, setLengthCheck] = useState(false);
  const [lowerCaseCheck, setLowerCaseCheck] = useState(false);
  const [upperCaseCheck, setUpperCaseCheck] = useState(false);
  const [numberCheck, setNumberCheck] = useState(false);
  const [symbolCheck, setSymbolCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const passwordChecks = [
    { check: lengthCheck, message: 'Must be 8 or more characters' },
    { check: lowerCaseCheck, message: 'Must contain a lower case letter' },
    { check: upperCaseCheck, message: 'Must contain an upper case letter' },
    { check: numberCheck, message: 'Must contain a number' },
    { check: symbolCheck, message: 'Must contain a symbol' },
  ];

  const allChecksPassed = passwordChecks.every((item) => item.check);

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setLengthCheck(password.length >= 8);
    setLowerCaseCheck(/[a-z]/.test(password));
    setUpperCaseCheck(/[A-Z]/.test(password));
    setNumberCheck(/[0-9]/.test(password));
    setSymbolCheck(/[^A-Za-z0-9]/.test(password));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const { success, error } = await signUp({ email, password });
      if (success) {
        toast.success("Account created!", {
          id: toastId
        });
        navigate('/dashboard');
      } else {
        console.log(error.code);
        if (error.code === "user_already_exists") {
          toast.error("An account with that email already exists", {
            id: toastId,
            action: {
              label: "Login",
              onClick: () => navigate('/login')
            }
          });
        } else {
          toast.error("An error occured", {
            id: toastId
          });
        }
        console.error('An error occured');
      }
    } catch (err) {
      console.error('An error occured: ', err);
    } finally {
      setLoading(false);
    }
  }

  const PasswordValidator = ({boolValue, message}: PasswordValidatorProps) => (
    <div className="flex flex-row items-center">
      {boolValue
        ? <TiTickOutline fontSize={32} color="green" />
        : <TiTimesOutline fontSize={32} color="red" />}
      <p>{message}</p>
    </div>
  );

  return (
    <div>
      <form className="max-w-md m-auto pt-24" onSubmit={handleSignUp}>
        <h2 className="pb-4">Sign Up</h2>
        <div className="flex flex-col gap-2">
          <TextInput
            type="email"
            placeholder="example@student.manchester.ac.uk"
            title="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="**********"
            title="Password"
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          <div className="text-left">
            {passwordChecks.map(({ check, message }, idx) => (
              <PasswordValidator key={idx} boolValue={check} message={message} />
            ))}
            <h3 className="my-3">
              Already have an account? <Link to="/login">Login!</Link>
            </h3>
          </div>
          <Button
            type="submit"
            loading={loading}
            loadingMessage="Creating account..."
            disabled={!allChecksPassed}
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignUp;