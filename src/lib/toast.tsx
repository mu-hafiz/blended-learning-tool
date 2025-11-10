import { toast as sonnerToast } from "sonner";
import { FaTrophy } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";

export const toast = {
  ...sonnerToast,
  achievement: (title: string, description: string) => {
    return sonnerToast(title,
      {
        icon: <FaTrophy size={30} className='text-yellow-500' />,
        description,
        duration: 6000,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right"
      }
    )
  },
  notification: (title: string, description: string) => {
    return sonnerToast(title,
      {
        icon: <TbBellRingingFilled size={30} />,
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