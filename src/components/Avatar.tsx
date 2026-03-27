import { supabase } from "@lib/supabaseClient";
import { useAuth } from "@providers/AuthProvider";

type AvatarProps = {
  filePath: string | undefined;
  size?: number;
  className?: string;
  onClick?: () => void;
};

const Avatar = ({ filePath, size = 10, className = "", onClick } : AvatarProps) => {
  const { user, userProfile } = useAuth();

  if (!filePath) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full flex items-center justify-center text-sm ${className}`}
      >
        ?
      </div>
    )
  }

  const publicUrl = supabase.storage.from('profilePictures').getPublicUrl(filePath).data?.publicUrl ?? null;

  const avatarUrl = user?.id && userProfile?.profile_picture_updated_at && filePath.includes(user.id)
    ? `${publicUrl}?t=${new Date(userProfile?.profile_picture_updated_at)}`
    : publicUrl;

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden flex-shrink-0 aspect-square ${className}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="w-full h-full object-cover"
          onClick={onClick}
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