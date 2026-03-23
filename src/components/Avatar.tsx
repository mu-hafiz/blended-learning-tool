import { supabase } from "@lib/supabaseClient";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useState } from "react";

type AvatarProps = {
  filePath: string | undefined;
  size?: number;
  className?: string;
};

const Avatar = ({ filePath, size = 10, className = "" } : AvatarProps) => {
  const { user, userProfile } = useAuth();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setUrl(null);
      return;
    }

    const publicUrl = supabase.storage.from('profilePictures').getPublicUrl(filePath).data?.publicUrl ?? null;
    if (!publicUrl) {
      setUrl(null);
      return;
    }

    const avatarUrl = user?.id && userProfile?.profile_picture_updated_at && filePath.includes(user.id)
      ? `${publicUrl}?t=${new Date(userProfile?.profile_picture_updated_at)}`
      : publicUrl;
    setUrl(avatarUrl);
  }, [user, filePath, userProfile]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden ${className}`}
    >
      {url ? (
        <img
          src={url}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm">
          ?
        </div>
      )}
    </div>
  );
};

export default Avatar;