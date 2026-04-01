import { Button, RHFTextInput } from "@components";
import { useState, useEffect } from "react";
import { toast } from "@lib/toast";
import { TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { useDebounce } from "@hooks/useDebounce";
import { type ProfileValues } from "../types/formSchemas";
import UsersDB from "@lib/db/users";
import { useOutletContext } from "react-router-dom";
import { type AccountOutletContext } from "../types/stateTypes";
import { tryCatch } from "@utils/tryCatch";
import { useAuth } from "@providers/AuthProvider";

const BasicInfo = () => {
  const { user, setUserProfile } = useAuth();
  const { profileForm } = useOutletContext<AccountOutletContext>();
  const { control, handleSubmit, watch, formState: { isSubmitting, isDirty, dirtyFields }, reset, getValues, setError, clearErrors } = profileForm;

  const [validUsername, setValidUsername] = useState<boolean | undefined>(undefined);

  const username = watch("username");
  const debouncedUsername = useDebounce(username);

  useEffect(() => {
    let cancelled = false;

    const checkUsername = async () => {
      if (debouncedUsername.value.length < 4) {
        setError('username', {type: 'minLength', message: '4 characters min'});
      } else if (debouncedUsername.value.length > 30) {
        setError('username', {type: 'maxLength', message: '30 characters max'});
      } else {
        clearErrors('username')
      }
      await new Promise(resolve => setTimeout(resolve, 10));
      if (!cancelled) {
        const { data: valid, error } = await tryCatch(UsersDB.checkUsername(debouncedUsername.value));
        if (cancelled) return;
        if (error) {
          toast.error("There was an error checking username, please try again later");
        } else {
          setValidUsername(valid);
        }
      }
    };

    if (debouncedUsername.ready && dirtyFields.username) checkUsername();
    return () => { cancelled = true; };

  }, [debouncedUsername]);

  useEffect(() => {
    setValidUsername(undefined);
  }, [username]);

  const handleProfileUpdate = async (data: ProfileValues) => {
    if (!user) return;
    if (validUsername === false) {
      toast.error("That username is taken.");
      return;
    }

    const sanitisedData = {
      ...data,
      username: data.username.toLowerCase()
    }

    const toastId = toast.loading("Updating profile...");
    const { error } = await tryCatch(UsersDB.updateUser(user.id, sanitisedData));

    if (error) {
      toast.error("Could not update profile, please try again later.", {
        id: toastId
      });
      return;
    }

    setUserProfile((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        username: data.username.toLowerCase(),
        first_name: data.firstName,
        middle_name: data.middleName ?? null,
        last_name: data.lastName,
        about_me: data.aboutMe ?? null,
      }
    });

    reset(getValues());
    toast.success("Profile updated!", {
      id: toastId
    });
  }

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate)}>
      <h2>Basic Info</h2>
      <p className="subtitle">This information will be displayed on your profile (depending on your privacy settings)</p>
      <hr className="divider"/>
      <RHFTextInput
        name="username"
        control={control}
        title="Username"
        description="This needs to be 4-30 characters long"
        maxLength={30}
      />
      <div className="flex flex-row items-center">
        {dirtyFields.username && !(debouncedUsername.value.length < 4) && !(debouncedUsername.value.length > 30) && (
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
          containerClassName="flex-1"
        />
        <RHFTextInput
          name="middleName"
          control={control}
          title="Middle Name"
          required={false}
          containerClassName="flex-1"
        />
        <RHFTextInput
          name="lastName"
          control={control}
          title="Last Name"
          containerClassName="flex-1"
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

export default BasicInfo;