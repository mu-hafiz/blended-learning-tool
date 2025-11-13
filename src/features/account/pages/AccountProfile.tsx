import { Button, RHFTextInput } from "@components";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import { toast } from "@lib/toast";
import { TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { useDebounce } from "@hooks/useDebounce";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileValues } from "../types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import UsersDB from "@lib/db/users";

const AccountProfile = () => {
  const { user } = useAuth();
  const [validUsername, setValidUsername] = useState<boolean | undefined>(undefined);

  const { control, handleSubmit, watch, formState: { isSubmitting, isDirty, dirtyFields }, reset, getValues, setError, clearErrors } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema)
  });

  const username = watch("username");
  const debouncedUsername = useDebounce(username);

  useEffect(() => {
    let cancelled = false;

    const checkUsername = async () => {
      if (debouncedUsername.value.length < 6) {
        setError('username', {type: 'minLength', message: '6 characters min'});
      } else if (debouncedUsername.value.length > 30) {
        setError('username', {type: 'maxLength', message: '30 characters max'});
      } else {
        clearErrors('username')
      }
      await new Promise(resolve => setTimeout(resolve, 10));
      if (!cancelled) {
        const valid = await UsersDB.checkUsername(debouncedUsername.value);
        setValidUsername(valid);
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
      const data = await UsersDB.getUser(user.id);
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
    if (!user) return;
    if (validUsername === false) {
      toast.error("That username is taken.");
      return;
    }

    const toastId = toast.loading("Updating profile...");
    const success = await UsersDB.updateUser(user.id, data);

    if (!success) {
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
    <form onSubmit={handleSubmit(handleProfileUpdate)}>
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
        {dirtyFields.username && !(debouncedUsername.value.length < 6) && !(debouncedUsername.value.length > 30) && (
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