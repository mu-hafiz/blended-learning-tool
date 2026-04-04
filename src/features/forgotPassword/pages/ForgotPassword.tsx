import { Button, TextInput } from "@components";
import { Link } from "react-router-dom";
import { toast } from "@lib/toast";
import { useState } from "react";
import { supabase } from "@lib/supabaseClient";

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading("Sending link...");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_SITE_URL}/account/reset`,
    });
    if (error) {
      toast.error("Could not send link, please try again later", { id: toastId });
      console.log("Could not send link: ", error);
      return;
    } else {
      toast.success("Email sent! Please check your junk.", { id: toastId });
    }
    setSubmitting(false);
  }

  return (
    <div className="bg-surface-primary rounded-2xl w-full sm:w-130 p-6 pb-10">
      <form onSubmit={handleReset}>
        <h1 className="text-center">Forgot Password</h1>
        <h2 className="text-center">A reset link will be sent to your email</h2>
        <h3 className="text-center text-error-text mb-4">Please check your junk!</h3>
        <div className="flex flex-col gap-2">
          <TextInput
            type="email"
            placeholder="example@gmail.com"
            title="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h3 className="my-3 text-left">
            Just remembered? <Link to="/account/login" className="link">Log in!</Link>
          </h3>
          <Button
            type="submit"
            loading={submitting}
            loadingMessage="Sending..."
          >
            Send Reset Link
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;