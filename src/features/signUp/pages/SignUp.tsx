import { useState } from "react";
import SignUpDetails from "../components/SignUpDetails";
import ValidateOTP from "../components/ValidateOTP";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<{ email: string, password: string }>({
    email: "", password: ""
  });

  return (
    <div className="bg-surface-primary rounded-2xl w-full sm:w-130 p-6 pb-10">
      {step === 1 && (
        <SignUpDetails
          setStep={setStep}
          setData={setData}
        />
      )}
      {step === 2 && (
        <ValidateOTP
          email={data?.email}
          password={data?.password}
        />
      )}
    </div>
  )
}

export default SignUp;