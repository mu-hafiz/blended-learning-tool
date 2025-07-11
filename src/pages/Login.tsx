import { useState } from "react";
import { useAuth } from "@providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "@components";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const { success, error } = await login({ email, password });
      if (success) {
        toast.success("Log in successful!", {
          id: toastId
        });
        navigate('/dashboard');
      } else {
        const message = error.code === "invalid_credentials"
          ? "The provided login details are incorrect"
          : "An error occured"
        toast.error(message, {
          id: toastId
        });
        console.error('An error occured', error);
      }
    } catch (err) {
      console.error('An error occured: ', err);
      toast.error("An error occured", {
        id: toastId
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="max-w-md m-auto pt-24" onSubmit={handleLogin}>
        <h2 className="pb-4">Log In</h2>
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
          <h3 className="my-3 text-left">
            Don't have an account? <Link to="/signup">Sign up!</Link>
          </h3>
          <Button
            type="submit"
            loading={loading}
            loadingMessage="Signing in..."
          >
            Log In
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login;