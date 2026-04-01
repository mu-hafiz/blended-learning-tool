import { useAuth } from "@providers/AuthProvider";
import { toast } from "@lib/toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@lib/supabaseClient";
import { Button, TextInput } from "@components";
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

  const handleChange = (value: string) => {
    setOtp(value);
    if (value.length >= 6) {
      handleSignUp(value);
    }
  }

  const handleSignUp = async (otp: string) => {
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
  
      toast.loading("Signing you up...", {
        id: toastId
      });
  
      const signUpResult = await signUp({ email, password });
      
      if (signUpResult.success) {
        toast.success("OTP Successful!", {
          id: toastId
        });
      } else {
        if (signUpResult.error.code === "user_already_exists") {
          toast.error("An account with that email already exists", {
            id: toastId,
            action: {
              label: "Login",
              onClick: () => navigate('/account/login')
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
    <form onSubmit={() => handleSignUp(otp)}>
      <h2 className="text-center text-primary-text mb-2">One-Time Password</h2>
      <p className="text-center text-secondary-text">An OTP has been sent to your email, please enter below:</p>
      <p className="text-center text-error mb-8">PLEASE CHECK YOUR JUNK FOLDER! (it's most likely in there...)</p>
      <TextInput
        value={otp}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="CLGVDI"
        disabled={loading}
        maxLength={6}
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