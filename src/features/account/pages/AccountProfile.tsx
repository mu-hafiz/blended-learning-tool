import { Button, RHFTextInput } from "@components";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { useDebounce } from "@hooks/useDebounce";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileValues } from "../types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

const AccountProfile = () => {
  const { user } = useAuth();
  const [validUsername, setValidUsername] = useState<boolean | undefined>(undefined);

  const { control, handleSubmit, watch, formState: { isSubmitting, isDirty, dirtyFields }, reset, getValues } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema)
  });

  const username = watch("username");
  const debouncedUsername = useDebounce(username);

  useEffect(() => {
    let cancelled = false;

    const checkUsername = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      if (!cancelled) {
        const { count } = await supabase.from('usernames')
          .select('username', { count: 'exact', head: true })
          .eq('username', debouncedUsername.value);

        setValidUsername(count === 0);
      }
    };

    if (debouncedUsername.ready && dirtyFields.username) checkUsername();
    return () => { cancelled = true; };

  }, [debouncedUsername]);

  useEffect(() => {
    setValidUsername(undefined);
  }, [username]);

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      const { data, error } = await supabase.from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error("Could not get user's profile information: ", error);
        throw new Error("Could not get user's profile information: ", error);
      };
      reset({
        username: data.username,
        firstName: data.first_name,
        middleName: data.middle_name ?? "",
        lastName: data.last_name,
        aboutMe: data.about_me ?? ""
      });
    }
    
    fetchUserInfo();
  }, [user]);

  const handleProfileUpdate = async (data: ProfileValues) => {
    if (validUsername === false) {
      toast.error("That username is taken.");
      return;
    }

    const toastId = toast.loading("Updating profile...");
    const { error } = await supabase.from('users')
      .update({
        username: data.username,
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        about_me: data.aboutMe
      })
      .eq('user_id', user!.id);

    if (error) {
      console.error("Could not update user's profile information: ", error);
      toast.error("Could not update profile, please try again later.", {
        id: toastId
      });
      return;
    }

    reset(getValues());
    toast.success("Profile updated!", {
      id: toastId
    });
  }

  return (
    <form className="m-2 mt-4" onSubmit={handleSubmit(handleProfileUpdate)}>
      <h2>Basic Info</h2>
      <p className="text-secondary-text">This information will be displayed on your profile (depending on your privacy settings)</p>
      <hr className="border-surface-secondary my-3"/>
      <RHFTextInput
        name="username"
        control={control}
        title="Username"
        description="This needs to be 6-30 characters long"
      />
      <div className="flex flex-row items-center">
        {dirtyFields.username && (
          !debouncedUsername.ready || validUsername === undefined ? (
            <p className="text-secondary-text mt-2">Checking if username is free...</p>
          ) : validUsername ? (
            <div className="flex flex-row items-center mt-1">
              <TiTickOutline size={40} className="text-success"/>
              <p className="text-success">Hurray! That username is available!</p>
            </div>
          ) : (
            <div className="flex flex-row items-center mt-1">
              <TiTimesOutline size={40} className="text-error"/>
              <p className="text-error">Sorry, that username is taken.</p>
            </div>
          )
        )}
      </div>
      <div className="flex flex-row justify-between gap-6 my-3">
        <RHFTextInput
          name="firstName"
          control={control}
          title="First Name"
        />
        <RHFTextInput
          name="middleName"
          control={control}
          title="Middle Name"
          required={false}
        />
        <RHFTextInput
          name="lastName"
          control={control}
          title="Last Name"
        />
      </div>
      <RHFTextInput
        name="aboutMe"
        control={control}
        title="About Me"
        required={false}
        multiline
      />
      <div className="flex flex-row justify-center mt-5">
        <Button
          type="submit"
          loading={isSubmitting}
          loadingMessage="Updating..."
          disabled={!isDirty}
        >
          Update profile
        </Button>
      </div>
    </form>
  );
};

export default AccountProfile;