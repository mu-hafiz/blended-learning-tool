import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@components";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";
import { profileSchema, type ProfileValues } from "../types/formSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@providers/AuthProvider";
import { toast } from "@lib/toast";

const routes = ["profile", "courses", "privacy", "preferences"]

const Onboarding = () => {
  const { signOut, finishOnboarding } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const step = routes.findIndex((route) => location.pathname.includes(route)) + 1;
  const [maxStep, setMaxStep] = useState(1);
  const [buttonClicked, setButtonClicked] = useState(false);
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      firstName: "",
      middleName: "",
      lastName: "",
      aboutMe: ""
    }
  });

  useEffect(() => {
    if (step > maxStep) {
      navigate(`/account/onboarding/${routes[maxStep-1]}`, { replace: true })
    }
  }, [step, maxStep, navigate])

  const goToNextStep = async () => {
    setMaxStep((prev) => Math.max(prev, step + 1));
    if (step >= routes.length) {
      console.log("Starting account creation")
      setButtonClicked(true);
      const toastId = toast.loading("Creating account...");
      const { success, error } = await finishOnboarding(profileForm.getValues());

      if (success) {
        toast.success("Account created!", {
          id: toastId
        });
      } else {
        toast.error("Something went wrong, please try again", {
          id: toastId
        });
        console.log("An error occured")
        console.log(error);
        setButtonClicked(false);
      }

    } else {
      navigate(`/account/onboarding/${routes[step]}`);
    }
  }

  const goToLastStep = () => {
    if (step > 1) {
      navigate(`/account/onboarding/${routes[step-2]}`);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-surface-primary rounded-2xl w-130 p-6">
        <div className="grid grid-cols-3 items-center mb-4">
          <div>
            <Button
              variant="danger"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>

          <h1 className="text-center capitalize">
            {routes[step - 1]}
          </h1>

          <div />
        </div>
        <Outlet
          context={{
            buttonClicked,
            setButtonClicked,
            goToNextStep,
            profileForm
          }}
        />
        <div className="grid grid-cols-3 mt-6">
          <Button
            variant="secondary"
            className="w-auto flex justify-self-start items-center"
            onClick={() => goToLastStep()}
            disabled={step === 1 || buttonClicked}
          >
            <TiArrowLeftThick size={30}/>
          </Button>
          <div className="flex gap-4 justify-center mt-4">
            {routes.map((route, idx) => {
              const isFutureStep = idx + 1 > step;
              return <NavLink
                key={route}
                to={route}
                onClick={(e) => {if (isFutureStep) e.preventDefault();}}
                className={({ isActive }) => (
                  isActive ? "w-4 h-4 rounded-full cursor-default bg-warning animate-pulse"
                  : idx + 1 < step ? "w-4 h-4 rounded-full bg-success"
                  : "w-4 h-4 rounded-full bg-white cursor-default"
                )}
              />
            })}
          </div>
          <Button
            className="w-auto flex justify-self-end items-center"
            onClick={() => setButtonClicked(true)}
            disabled={buttonClicked}
          >
            <TiArrowRightThick size={30}/>
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Onboarding;