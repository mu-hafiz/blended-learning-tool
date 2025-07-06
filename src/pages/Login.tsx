import { useState } from "react";
import { useAuth } from "@providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import { Link } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/dashboard');
      } else {
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
      <form className="max-w-md m-auto pt-24" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold pb-4">Log In</h2>
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