import { useState } from "react";
import { useAuth } from "@providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput, PasswordValidator } from "@components";
import { toast } from "sonner";
import { validatePassword } from "@utils/validatePassword";

const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const { passwordChecks, allChecksPassed } = validatePassword(password);

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
            onChange={(e) => setPassword(e.target.value)}
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