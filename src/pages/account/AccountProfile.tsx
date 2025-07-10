import Button from "@components/Button";
import TextInput from "@components/TextInput";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";
import type { Profile } from "@models/tables";

const AccountProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      const { data, error } = await supabase.from('profiles').select('*').single();
      if (error) {
        console.error("Could not get user's profile information: ", error);
        throw new Error("Could not get user's profile information: ", error);
      };
      setProfile(data);
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
    console.log("This will update the user's profile");
  }

  return (
    <form className="m-2" onSubmit={handleProfileUpdate}>
      <TextInput
        title="Username"
        placeholder="username"
        value={profile?.username ?? ""}
        onChange={handleChange("username")}
      />
      <div className="flex flex-row justify-between gap-6 my-3">
        <TextInput
          title="First Name"
          placeholder="firstname"
          value={profile?.first_name ?? ""}
          onChange={handleChange("first_name")}
        />
        <TextInput
          title="Middle Name"
          placeholder="middlename"
          value={profile?.middle_name ?? ""}
          onChange={handleChange("username")}
        />
        <TextInput
          title="Last Name"
          placeholder="lastname"
          value={profile?.last_name ?? ""}
          onChange={handleChange("username")}
        />
      </div>
      <TextInput
        title="About Me"
        placeholder="aboutme"
        multiline
      />
      <div className="flex flex-row justify-center mt-5">
        <Button type="submit">
          Update profile
        </Button>
      </div>
    </form>
  );
};

export default AccountProfile;