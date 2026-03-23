import { Avatar, Button } from "@components";
import { useRef, useState } from "react";
import imageCompression from 'browser-image-compression';
import { supabase } from "@lib/supabaseClient";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";
import UserDB from "@lib/db/users";
import { useAuth } from "@providers/AuthProvider";

const allowedFileTypes = ["image/png", "image/jpeg", "image/webp", "image/heic"];

const ProfilePicture = () => {
  const { user, userProfile, setUserProfile } = useAuth();

  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("Could not update profile picture, please try again later");
      console.error("User ID is undefined/null");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading profile picture...");

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
    <div>
      <h2>Profile Picture</h2>
      <p className="subtitle">Express yourself with a picture!</p>
      <hr className="divider"/>
      <div className="flex items-center justify-center gap-5">
        <Avatar
          filePath={userProfile?.profile_picture}
          size={100}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <h3>Must be JPG, JPEG, PNG, or WEBP</h3>
          <Button
            disabled={uploading}
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
    </div>
  );
}

export default ProfilePicture;