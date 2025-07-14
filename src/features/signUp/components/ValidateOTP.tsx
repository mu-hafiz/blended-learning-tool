import { useAuth } from "@providers/AuthProvider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@lib/supabaseClient";
import { OTPInput, type SlotProps } from "input-otp";
import { Button } from "@components";
import { useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";

type OTPInputProps = {
  email: string;
  password: string;
}

const ValidateOTP = ({ email, password }: OTPInputProps) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSignUp = async () => {
    setLoading(true);
    const toastId = toast.loading("Checking OTP...");

    try {
      const otpData = await supabase.functions.invoke("check-otp", {
        body: { email, otp }
      });

      if (otpData.error instanceof FunctionsHttpError) {
        const errorMessage = await otpData.error.context.json();
        toast.error(errorMessage.error, {
          id: toastId
        });
        return;
      }
  
      toast.loading("Creating account...", {
        id: toastId
      });
  
      const signUpResult = await signUp({ email, password });
      
      if (signUpResult.success) {
        toast.success("Account created!", {
          id: toastId
        });
        navigate('/dashboard');
      } else {
        if (signUpResult.error.code === "user_already_exists") {
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
    } finally {
      setLoading(false);
    }    
  }

  return (
    <form onSubmit={handleSignUp}>
      <h2 className="text-center text-primary-text mb-2">One-Time Password</h2>
      <p className="text-center text-secondary-text mb-8">An OTP has been sent to your email, please enter below:</p>
      <OTPInput
        value={otp}
        onChange={(value) => {setOtp(value)}}
        maxLength={6}
        onComplete={handleSignUp}
        disabled={loading}
        render={({ slots }) => (
          <div className="flex space-x-2 justify-center">
            {slots.map((slot, idx) => (
              <input
                key={idx}
                {...slot}
                className="w-12 h-12 text-center text-xl border rounded"
              />
            ))}
          </div>
        )}
      />
      <div className="flex flex-col justify-center">
        <Button
          type="submit"
          loading={loading}
          loadingMessage="Verifying..."
          className="mt-8"
        >
          Check OTP
        </Button>
      </div>
    </form>
  );
}

export default ValidateOTP;