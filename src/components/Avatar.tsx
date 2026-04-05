import { supabase } from "@lib/supabaseClient";
import { useAuth } from "@providers/AuthProvider";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type AvatarProps = {
  filePath: string | undefined;
  size?: number;
  classNameSize?: string;
  className?: string;
  onClick?: () => void;
};

const Avatar = ({ filePath, size = 10, classNameSize="", className = "", onClick } : AvatarProps) => {
  const { user, userProfile } = useAuth();
  const [imgError, setImgError] = useState(false);

  if (!filePath) {
    return (
      <div
        style={!classNameSize ? { width: size, height: size } : undefined}
        className={twMerge("rounded-full flex items-center justify-center border border-surface-tertiary", className, classNameSize)}
      >
        <h3>?</h3>
      </div>
    )
  }

  const publicUrl = supabase.storage.from('profilePictures').getPublicUrl(filePath).data?.publicUrl ?? null;

  const avatarUrl = user?.id && userProfile?.profile_picture_updated_at && filePath.includes(user.id)
    ? `${publicUrl}?t=${new Date(userProfile?.profile_picture_updated_at)}`
    : publicUrl;

  return (
    <div
      style={!classNameSize ? { width: size, height: size } : undefined}
      className={twMerge("rounded-full overflow-hidden flex-shrink-0 aspect-square border border-surface-tertiary", className, classNameSize)}
    >
      {avatarUrl && !imgError ? (
        <img
          src={avatarUrl}
          className="w-full h-full object-cover"
          onClick={onClick}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface-tertiary border border-surface-tertiary">
          <h3>?</h3>
        </div>
      )}
    </div>
  );
};

export default Avatar;