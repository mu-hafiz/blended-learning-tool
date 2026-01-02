import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { PageContainer, Tabs } from "@components";
import UserPrivacyDB from '@lib/db/userPrivacy';
import { useAuth } from "@providers/AuthProvider";
import { type PrivacySettings } from '../types/stateTypes';
import { profileSchema, securitySchema, type ProfileValues, type SecurityValues } from "../types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import UsersDB from "@lib/db/users";
import { useForm } from "react-hook-form";

const routeNames = ["profile", "security", "privacy", "preferences"];

const Account = () => {
  const { user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);

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
      const data = await UserPrivacyDB.getPrivacySettings(user.id);
      const { user_id, created_at, ...privacyData } = data;
      setPrivacySettings(privacyData);
    }

    const fetchUserInfo = async () => {
      const data = await UsersDB.getUser(user.id);
      profileForm.reset({
        username: data.username,
        firstName: data.first_name!,
        middleName: data.middle_name ?? "",
        lastName: data.last_name!,
        aboutMe: data.about_me ?? ""
      });
    }

    getPrivacySettings();
    fetchUserInfo();
  }, [user]);

  return (
    <PageContainer title="Account">
      <Tabs routes={routeNames}/>
      <div className="basic-container rounded-tl-none">
        <Outlet
          context={{
            privacySettings,
            setPrivacySettings,
            profileForm,
            securityForm,
            user
          }}
        />
      </div>
    </PageContainer>
  )
}

export default Account;