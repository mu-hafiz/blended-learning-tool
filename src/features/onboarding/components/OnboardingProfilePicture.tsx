import { useOutletContext } from "react-router-dom";
import type { OnboardingOutletContext } from "../types/stateTypes";
import { useEffect, useRef } from "react";
import { useAuth } from "@providers/AuthProvider";
import { Avatar, Button } from "@components";

const OnboardingProfilePicture = () => {
  const { buttonClicked, setButtonClicked, goToNextStep, handleFileUpload, uploading } = useOutletContext<OnboardingOutletContext>();
  const { userProfile } = useAuth();
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!buttonClicked) return;
    goToNextStep();
    setButtonClicked(false);
  }, [buttonClicked]);

  return (
    <>
      <h3>Express yourself with a picture!</h3>
      <hr className="divider"/>
      <div className="flex items-center justify-center gap-5">
        <Avatar
          filePath={userProfile?.profile_picture}
          size={100}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <h3>Must be JPG, JPEG, PNG, or WEBP</h3>
          <Button
            loading={uploading}
            loadingMessage="Uploading..."
            onClick={() => fileUploadRef.current?.click()}
          >
            Upload Here
          </Button>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileUploadRef}
          />
        </div>
      </div>
    </>
  );
};
export default OnboardingProfilePicture;