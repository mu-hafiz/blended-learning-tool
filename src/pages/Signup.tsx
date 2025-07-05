import { useState, useEffect } from "react";
import { useAuth } from "@providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { session, signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUp({ email, password });
      if (result.success) {
        navigate('/');
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
      <form className="max-w-md m-auto pt-24" onSubmit={handleSignUp}>
        <h2 className="text-2xl font-bold pb-4">Signup</h2>
        <div className="flex flex-col gap-2">
          <h3 className="text-left">Email</h3>
          <input
            className="p-3 bg-neutral-900 rounded-xl"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <h3 className="text-left">Password</h3>
          <input
            className="p-3 bg-neutral-900 rounded-xl"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-5"
            type="submit"
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  )
}

export default Signup;