import { Button, TextInput } from "@components";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@lib/supabaseClient";
import type { Profile } from "@models/tables";
import { toast } from "sonner";

const AccountProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [profileUpdating, setProfileUpdating] = useState(false);

  const hasChanges = useMemo(() => {
    return !(JSON.stringify(profile) === JSON.stringify(originalProfile))
  }, [profile, originalProfile]);

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      const { data, error } = await supabase.from('profiles').select('*').single();
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
      toast.error("Could not update profile...", {
        id: toastId
      })
      throw new Error("Could not update user's profile information: ", error);
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
      <hr className="border-surface-secondary my-3"/>
      <TextInput
        title="Username"
        value={profile?.username ?? ""}
        onChange={handleChange("username")}
      />
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
        multiline
      />
      <div className="flex flex-row justify-center mt-5">
        <Button
          type="submit"
          loading={profileUpdating}
          loadingMessage="Updating..."
          disabled={!hasChanges}
        >
          Update profile
        </Button>
      </div>
    </form>
  );
};

export default AccountProfile;