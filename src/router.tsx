import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@components/RootLayout";
import LandingPage from "@features/landing/pages/LandingPage";
import SignUp from "@features/signUp/pages/SignUp";
import Onboarding from "@features/onboarding/pages/Onboarding";
import OnboardingProfile from "@features/onboarding/components/OnboardingProfile";
import OnboardingProfilePicture from "@features/onboarding/components/OnboardingProfilePicture";
import OnboardingPrivacy from "@features/onboarding/components/OnboardingPrivacy";
import OnboardingPreferences from "@features/onboarding/components/OnboardingPreferences";
import { ProtectedRoutes, AnonymousRoutes, OnboardingRoutes } from "@components";
import Dashboard from "@features/dashboard/pages/Dashboard";
import Login from "@features/login/pages/Login";
import NotFound from "@pages/NotFound";
import Notifications from "@features/notifications/pages/Notifications";
import Account from "@features/account/pages/Account";
import AccountProfile from "@features/account/pages/AccountProfile";
import AccountSecurity from "@features/account/pages/AccountSecurity";
import AccountPrivacy from "@features/account/pages/AccountPrivacy";
import AccountPreferences from "@features/account/pages/AccountPreferences";
import Progression from "@features/progression/pages/Progression";
import ProgressionLevel from "@features/progression/pages/ProgressionLevel";
import ProgressionAchievements from "@features/progression/pages/ProgressionAchievements";
import ProgressionStatistics from "@features/progression/pages/ProgressionStatistics";
import Profile from "@features/profile/pages/Profile";
import ProfileStatistics from "@features/profile/pages/ProfileStatistics";
import ProfileAchievements from "@features/profile/pages/ProfileAchievements";
import ProfileFriends from "@features/profile/pages/ProfileFriends";
import Friends from "@features/friends/pages/Friends";
import FriendsList from "@features/friends/pages/FriendsList";
import FriendsIncoming from "@features/friends/pages/FriendsIncoming";
import FriendsOutgoing from "@features/friends/pages/FriendsOutgoing";
import Leaderboards from "@features/leaderboards/pages/Leaderboards";
import Flashcards from "@features/flashcards/pages/Flashcards";
import FlashcardSet from "@features/flashcards/pages/FlashcardSet";
import FlashcardSetFocused from "@features/flashcards/pages/FlashcardSetFocused";
import FlashcardSetCreate from "@features/flashcards/pages/FlashcardSetCreate";

export const router = createBrowserRouter([
  { path: "/", element: <RootLayout />, errorElement: <NotFound />, children: [

    { path: "/", element: <LandingPage /> },

    { element: <AnonymousRoutes />, children: [
      { path: "/account/signup", element: <SignUp /> },
      { path: "/account/login", element: <Login /> },
    ]},

    { element: <OnboardingRoutes />, children: [
      { path: "/account/onboarding", element: <Onboarding />, children: [
        { index: true, element: <Navigate to="profile" replace /> },
        { path: "profile", element: <OnboardingProfile /> },
        { path: "profilePicture", element: <OnboardingProfilePicture /> },
        { path: "privacy", element: <OnboardingPrivacy /> },
        { path: "preferences", element: <OnboardingPreferences /> },
      ]},
    ]},

    { element: <ProtectedRoutes />, children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/friends", element: <Friends />, children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: "list", element: <FriendsList /> },
        { path: "incoming", element: <FriendsIncoming /> },
        { path: "outgoing", element: <FriendsOutgoing /> }
      ]},
      { path: "/account", element: <Account />, children: [
        { index: true, element: <Navigate to="profile" replace /> },
        { path: "profile", element: <AccountProfile /> },
        { path: "security", element: <AccountSecurity /> },
        { path: "privacy", element: <AccountPrivacy /> },
        { path: "preferences", element: <AccountPreferences /> }
      ]},
      { path: "/progression", element: <Progression />, children: [
        { index: true, element: <Navigate to="level" replace /> },
        { path: "level", element: <ProgressionLevel /> },
        { path: "achievements", element: <ProgressionAchievements /> },
        { path: "statistics", element: <ProgressionStatistics /> }
      ]},
      { path: "/leaderboards", element: <Leaderboards /> },
      { path: "/profile/:username", element: <Profile />, children: [
        { index: true, element: <Navigate to="statistics" replace /> },
        { path: "statistics", element: <ProfileStatistics /> },
        { path: "achievements", element: <ProfileAchievements /> },
        { path: "friends", element: <ProfileFriends /> }
      ]},
      { path: "/flashcards", element: <Flashcards /> },
      { path: "/flashcards/create", element: <FlashcardSetCreate /> },
      { path: "/flashcards/:flashcardSetId", element: <FlashcardSet /> },
      { path: "/flashcards/:flashcardSetId/focused", element: <FlashcardSetFocused /> },
      { path: "/flashcards/:flashcardSetId/edit", element: <FlashcardSetCreate /> }
    ]}
  ]},
]);