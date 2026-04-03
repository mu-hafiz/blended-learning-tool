import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@components";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";
import { profileSchema, type ProfileValues } from "../types/formSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@providers/AuthProvider";
import { toast } from "@lib/toast";
import type { UserPrivacySettings } from "@models/tables";
import UserPrivacyDB from '@lib/db/userPrivacy';
import UserDB from "@lib/db/users";
import { tryCatch } from "@utils/tryCatch";
import { supabase } from "@lib/supabaseClient";
import imageCompression from 'browser-image-compression';
import heic2any from "heic2any";

const routes = ["profile", "profilePicture", "privacy", "preferences"]
const pageTitles = ["Basic Info", "Profile Picture", "Privacy Settings", "Preferences"]
const allowedFileTypes = ["image/png", "image/jpeg", "image/webp", "image/heic"];

const Onboarding = () => {
  const { user, signOut, finishOnboarding, setUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const step = routes.findIndex((route) => location.pathname.endsWith(route)) + 1;
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
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const getPrivacySettings = async () => {
      const { data, error } = await tryCatch(UserPrivacyDB.getPrivacySettings(user.id));
      if (error) {
        toast.error("Could not get privacy settings, please try again later");
        return;
      }
      const { user_id, created_at, ...privacyData } = data;
      setPrivacySettings(privacyData);
    }

    getPrivacySettings();
  }, [user]);

  useEffect(() => {
    if (step > maxStep) {
      navigate(`/account/onboarding/${routes[maxStep-1]}`, { replace: true })
    }
  }, [step, maxStep, navigate]);

  const goToNextStep = async () => {
    setMaxStep((prev) => Math.max(prev, step + 1));
    if (step >= routes.length) {
      console.log("Starting account creation")
      setButtonClicked(true);
      const toastId = toast.loading("Creating account...");
      if (!privacySettings) {
        toast.error("Something went wrong, please try again", {
          id: toastId
        });
        return;
      }

      const { data: result, error } = await tryCatch(finishOnboarding(profileForm.getValues(), privacySettings));
      if (error || !result.success) {
        toast.error("Something went wrong, please try again", {
          id: toastId
        });
        console.log("An error occured")
        console.log(error);
        setButtonClicked(false);
        return;
      }

      toast.success("Account created!", {
        id: toastId
      });

    } else {
      navigate(`/account/onboarding/${routes[step]}`);
    }
  }

  const goToLastStep = () => {
    if (step > 1) {
      navigate(`/account/onboarding/${routes[step-2]}`);
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("Could not update profile picture, please try again later");
      console.error("User ID is undefined/null");
      return;
    }

    let file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading profile picture...");

    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      try {
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 }) as Blob;
        file = new File([convertedBlob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
      } catch (err) {
        toast.error("Could not convert HEIC image. Please try a different image.", { id: toastId });
        console.error("HEIC conversion error:", err);
        return;
      }
    }

    if (!allowedFileTypes.includes(file.type)) {
      toast.error("File type is unsupported, please try another image", {
        id: toastId
      });
      return;
    }

    setUploading(true);

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 512,
      useWebWorker: true,
      fileType: "image/jpeg"
    });

    const { error: uploadError } = await supabase.storage
      .from('profilePictures')
      .upload(`${user.id}/profilePicture.jpg`, compressed, {
        upsert: true
      });

    if (uploadError) {
      toast.error("Could not update profile picture, please try again later.", {
        id: toastId
      });
      console.log("Could not update profile picture: ", uploadError);
      setUploading(false);
      return;
    }

    const { error: updateError } = await tryCatch(UserDB.updateProfilePicture(user.id, `${user.id}/profilePicture.jpg`));
    if (updateError) {
      toast.error("Could not update profile picture, please try again later.", {
        id: toastId
      });
      setUploading(false);
      return;
    }

    setUserProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profile_picture: `${user.id}/profilePicture.jpg`,
        profile_picture_updated_at: new Date().toISOString()
      };
    });

    toast.success("Profile picture updated!", {
      id: toastId
    })
    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-3">Create your account!</h1>
      <div className="bg-surface-primary rounded-2xl w-full sm:w-130 p-6">
        <div className="grid grid-cols-3 items-center mb-4">
          <div>
            <Button
              variant="danger"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>

          <h1 className="col-span-3 text-center capitalize">
            {pageTitles[step - 1]}
          </h1>

          <div />
        </div>
        <Outlet
          context={{
            buttonClicked,
            setButtonClicked,
            goToNextStep,
            profileForm,
            privacySettings,
            setPrivacySettings,
            handleFileUpload,
            uploading
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