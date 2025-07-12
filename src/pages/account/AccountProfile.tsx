import { Button, TextInput } from "@components";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@lib/supabaseClient";
import type { Profile } from "@models/tables";
import { toast } from "sonner";
import { TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { useDebounce } from "@hooks/useDebounce";

const AccountProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const debouncedProfile = useDebounce(profile);
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [validUsername, setValidUsername] = useState<boolean | undefined>(undefined);

  const usernameChanged = profile?.username !== originalProfile?.username;
  const hasChanges = useMemo(() => {
    return !(JSON.stringify(profile) === JSON.stringify(originalProfile))
  }, [profile, originalProfile]);

  useEffect(() => {
    let cancelled = false;
    const checkUsername = async () => {
      if (debouncedProfile?.username === originalProfile?.username) {
        setValidUsername(undefined);
        return;
      }
      const { count } = await supabase.from('profiles')
        .select('username', { count: 'exact', head: true })
        .eq('username', debouncedProfile?.username!);
      
      console.log("Count: ", count);

      if (!cancelled) setValidUsername(count === 0);
    };
    if (debouncedProfile?.username) checkUsername();
    return () => { cancelled = true; };
  }, [debouncedProfile, originalProfile]);

  useEffect(() => {
    if (profile?.username !== originalProfile?.username) {
      setValidUsername(undefined);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      const { data, error } = await supabase.from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error("Could not get user's profile information: ", error);
        throw new Error("Could not get user's profile information: ", error);
      };
      setProfile(data);
      setOriginalProfile(data);
    }
    
    fetchUserInfo();
  }, [user]);

  const handleChange = (key: keyof Profile) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: e.target.value });
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    setProfileUpdating(true);

    const toastId = toast.loading("Updating profile...");

    const { user_id, ...updatedFields } = profile;
    const { error } = await supabase.from('profiles')
      .update(updatedFields)
      .eq('user_id', user_id);

    if (error) {
      console.error("Could not update user's profile information: ", error);
      toast.error("Could not update profile, please try again later.", {
        id: toastId
      });
    }

    toast.success("Profile updated!", {
      id: toastId
    })
    setOriginalProfile(profile);
    setProfileUpdating(false);
  }

  return (
    <form className="m-2 mt-4" onSubmit={handleProfileUpdate}>
      <h2>Basic Info</h2>
      <p className="text-secondary-text">This information will be displayed on your profile (depending on your privacy settings)</p>
      <hr className="border-surface-secondary my-3"/>
      <TextInput
        title="Username"
        value={profile?.username ?? ""}
        onChange={handleChange("username")}
      />
      <div className="flex flex-row items-center">
        {usernameChanged && validUsername === true && (
          <div className="flex flex-row items-center mt-1">
            <TiTickOutline size={40} className="text-success"/>
            <p className="text-success">Hurray! That username is available!</p>
          </div>
        )}
        {usernameChanged && validUsername === false && (
          <div className="flex flex-row items-center mt-1">
            <TiTimesOutline size={40} className="text-error"/>
            <p className="text-error">Sorry, that username is taken.</p>
          </div>
        )}
        {usernameChanged && validUsername === undefined &&
          <p className="text-secondary-text mt-2">Checking if username is free...</p>
        }
        {!usernameChanged &&
          <p className="text-secondary-text mt-2">This needs to be unique!</p>
        }
      </div>
      <div className="flex flex-row justify-between gap-6 my-3">
        <TextInput
          title="First Name"
          value={profile?.first_name ?? ""}
          onChange={handleChange("first_name")}
        />
        <TextInput
          title="Middle Name"
          value={profile?.middle_name ?? ""}
          onChange={handleChange("middle_name")}
        />
        <TextInput
          title="Last Name"
          value={profile?.last_name ?? ""}
          onChange={handleChange("last_name")}
        />
      </div>
      <TextInput
        title="About Me"
        value={profile?.about_me ?? ""}
        onChange={handleChange("about_me")}
        required={false}
        multiline
      />
      <div className="flex flex-row justify-center mt-5">
        <Button
          type="submit"
          loading={profileUpdating}
          loadingMessage="Updating..."
          disabled={!hasChanges || !validUsername}
        >
          Update profile
        </Button>
      </div>
    </form>
  );
};

export default AccountProfile;