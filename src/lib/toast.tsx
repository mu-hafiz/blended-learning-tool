import { toast as sonnerToast } from "sonner";
import { FaTrophy, FaUserFriends, FaHeart } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { Button } from "@components";
import React from "react";
import { GrPaint } from "react-icons/gr";

type customToastProps = {
  title: string,
  description: string,
  navigate: () => void | Promise<void>
}

const AchievementIcon = () => <FaTrophy size={30} className='text-yellow-500' />;
const ThemeIcon = () => <GrPaint size={30} />;
const LevelIcon = () => <HiArrowTrendingUp size={30} className='text-yellow-500' />;
const FriendIcon = () => <FaUserFriends size={30} className='text-pink-600' />;
const LikeIcon = () => <FaHeart size={30} className='text-pink-600' />;
const NotificationIcon = () => <TbBellRingingFilled size={30} />;

export const toast = {
  ...sonnerToast,
  achievement: ({title, description, navigate}: customToastProps) => {
    const id = sonnerToast(title,
      {
        icon: <AchievementIcon />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right",
        action: <Button className="ml-auto whitespace-nowrap" onClick={() => {
          navigate()
          sonnerToast.dismiss(id)
        }}>Check it out!</Button>
      }
    )
  },
  theme: ({title, description, navigate}: customToastProps) => {
    const id = sonnerToast(title,
      {
        icon: <ThemeIcon />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right",
        action: <Button className="ml-auto whitespace-nowrap" onClick={() => {
          navigate()
          sonnerToast.dismiss(id)
        }}>Check it out!</Button>
      }
    )
  },
  level: ({title, description, navigate}: customToastProps) => {
    const id = sonnerToast(title,
      {
        icon: <LevelIcon />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right",
        action: <Button className="ml-auto whitespace-nowrap" onClick={() => {
          navigate()
          sonnerToast.dismiss(id)
        }}>See your progress</Button>
      }
    )
  },
  friend: ({title, description, navigate}: customToastProps) => {
    const id = sonnerToast(title,
      {
        icon: <FriendIcon />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#efd0e8",
        },
        position: "bottom-right",
        action: <Button className="ml-auto whitespace-nowrap" onClick={() => {
          navigate()
          sonnerToast.dismiss(id)
        }}>See your friends</Button>
      }
    )
  },
  like: ({title, description, navigate}: customToastProps) => {
    const id = sonnerToast(title,
      {
        icon: <LikeIcon />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#efd0e8",
        },
        position: "bottom-right"
        // action: <Button className="ml-auto whitespace-nowrap" onClick={() => {
        //   navigate()
        //   sonnerToast.dismiss(id)
        // }}>Check it out</Button>
      }
    )
  },
  notification: (title: string, description: string) => {
    return sonnerToast(title,
      {
        icon: <NotificationIcon />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
        },
        position: "bottom-right"
      }
    )
  }
}