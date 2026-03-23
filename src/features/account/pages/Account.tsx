import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { PageContainer, Tabs } from "@components";
import UserPrivacyDB from '@lib/db/userPrivacy';
import { useAuth } from "@providers/AuthProvider";
import { type UserPrivacySettings } from '@models/tables';
import { profileSchema, securitySchema, type ProfileValues, type SecurityValues } from "../types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tryCatch } from '@utils/tryCatch';
import { toast } from '@lib/toast';

const routeNames = ["profile", "security", "privacy", "preferences"];

const Account = () => {
  const { user, userProfile } = useAuth();
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings | null>(null);
  const [previousPrivacySettings, setPreviousPrivacySettings] = useState<UserPrivacySettings | null>(null);
  const [privacyEdited, setPrivacyEdited] = useState(false);
  const [privacySubmitting, setPrivacySubmitting] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema)
  });

  const securityForm = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    }
  });

  useEffect(() => {
    if (!user) return;

    const getPrivacySettings = async () => {
      const { data, error } = await tryCatch(UserPrivacyDB.getPrivacySettings(user.id));
      if (error) {
        toast.error("Could not get your privacy settings, please try again later");
        return;
      };
      const { user_id, created_at, ...privacyData } = data;
      setPrivacySettings(privacyData);
      setPreviousPrivacySettings(privacyData);
    }

    getPrivacySettings();
  }, [user]);

  useEffect(() => {
    if (!userProfile) return;
    profileForm.reset({
      username: userProfile.username,
      firstName: userProfile.first_name!,
      middleName: userProfile.middle_name ?? "",
      lastName: userProfile.last_name!,
      aboutMe: userProfile.about_me ?? ""
    });
  }, [userProfile])

  useEffect(() => {
    setPrivacyEdited(JSON.stringify(privacySettings) !== JSON.stringify(previousPrivacySettings));
  }, [privacySettings, previousPrivacySettings]);


  const handlePrivacySubmit = async () => {
    if (!user) return;

    const toastId = toast.loading("Submitting...");
    setPrivacySubmitting(true);

    const {error} = await tryCatch(UserPrivacyDB.setPrivacySettings(user.id, privacySettings!));
    if (error) {
      toast.error("Could not update privacy options, please try again later", {
        id: toastId
      });
    } else {
      toast.success("Updated privacy settings!", {
        id: toastId
      });
      setPreviousPrivacySettings(privacySettings);
    }
    setPrivacySubmitting(false);
  };

  return (
    <PageContainer title="Account">
      <Tabs routes={routeNames}/>
      <div className="basic-container rounded-tl-none">
        <Outlet
          context={{
            privacySettings,
            setPrivacySettings,
            previousPrivacySettings,
            privacyEdited,
            handlePrivacySubmit,
            privacySubmitting,
            profileForm,
            securityForm,
          }}
        />
      </div>
    </PageContainer>
  )
}

export default Account;