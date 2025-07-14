import { Link } from "react-router-dom";
import { Button, PasswordValidator, RHFTextInput } from "@components";
import { toast } from "sonner";
import { validatePassword } from "@utils/validatePassword";
import { signUpSchema, type SignUpValues } from "../types/formSchemas";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@lib/supabaseClient";
import { FunctionsHttpError } from "@supabase/supabase-js";

type SignUpProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>;
}

const SignUpDetails = ({ setStep, setData }: SignUpProps) => {
  const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const password = watch("password");
  const passwordChecks = validatePassword(password);

  const handleSendOTP = async (data: SignUpValues) => {
    const { email, password } = data;
    const toastId = toast.loading("Sending OTP...");

    try {
      const { error } = await supabase.functions.invoke("send-otp", {
        body: { email }
      });

      if (error instanceof FunctionsHttpError) {
        console.log("Error sending OTP: ", error);
        const errorMessage = await error.context.json();
        toast.error(errorMessage.error, {
          id: toastId
        });
        return;
      }

      toast.success("OTP sent successfully!", {
        id: toastId
      });
      
      setData({ email, password });
      setStep(2);

    } catch (err) {
      console.error('An error occured: ', err);
      toast.error("An error occured", {
        id: toastId
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSendOTP)}>
      <h2 className="text-center pb-4">Sign Up</h2>
      <div className="flex flex-col gap-2">
        <RHFTextInput
          name="email"
          control={control}
          type="email"
          placeholder="example@student.manchester.ac.uk"
          title="University Email"
        />
        <RHFTextInput
          name="password"
          control={control}
          type="password"
          placeholder="**********"
          title="Password"
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
          loading={isSubmitting}
          loadingMessage="Creating account..."
        >
          Create Account
        </Button>
      </div>
    </form>
  )
}

export default SignUpDetails;