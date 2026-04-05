import { toast as sonnerToast } from "sonner";
import { FaTrophy, FaUserFriends, FaHeart, FaPaintBrush, FaComment } from "react-icons/fa";
import { TbBellRingingFilled } from "react-icons/tb";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { Button } from "@components";
import { MdBookmarkAdd } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

type customToastProps = {
  title: string,
  description: string,
  navigate: () => void | Promise<void>
}

const AchievementIcon = () => <FaTrophy size={30} className='text-yellow-500' />;
const ThemeIcon = () => <FaPaintBrush size={30} className='text-yellow-500' />;
const LevelIcon = () => <HiArrowTrendingUp size={30} className='text-yellow-500' />;
const FriendIcon = () => <FaUserFriends size={30} className='text-pink-600' />;
const LikeIcon = () => <FaHeart size={30} className='text-pink-600' />;
const BookmarkIcon = () => <MdBookmarkAdd size={30} className='text-pink-600' />;
const CommentIcon = () => <FaComment size={30} className='text-pink-600' />;
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
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "0.5rem 1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right",
        action: (
          <div className="contents">
            <Button
              className="col-start-1 col-end-4 w-full mt-2" 
              onClick={() => {
                navigate();
                sonnerToast.dismiss(id);
              }}
            >
              See your achievements
            </Button>
            <button 
              onClick={() => sonnerToast.dismiss(id)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <RxCross2 size={25} />
            </button>
          </div>
        ),
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
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "0.5rem 1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right",
        action: (
          <div className="contents">
            <Button
              className="col-start-1 col-end-4 w-full mt-2" 
              onClick={() => {
                navigate();
                sonnerToast.dismiss(id);
              }}
            >
              Customise your theme
            </Button>
            <button 
              onClick={() => sonnerToast.dismiss(id)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <RxCross2 size={25} />
            </button>
          </div>
        ),
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
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "0.5rem 1rem",
          padding: "1rem",
          backgroundColor: "#fdf0be",
        },
        position: "bottom-right",
        action: (
          <div className="contents">
            <Button
              className="col-start-1 col-end-4 w-full mt-2" 
              onClick={() => {
                navigate();
                sonnerToast.dismiss(id);
              }}
            >
              See your progress
            </Button>
            <button 
              onClick={() => sonnerToast.dismiss(id)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <RxCross2 size={25} />
            </button>
          </div>
        ),
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
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "0.5rem 1rem",
          padding: "1rem",
          backgroundColor: "#efd0e8",
        },
        position: "bottom-right",
        action: (
          <div className="contents">
            <Button
              className="col-start-1 col-end-4 w-full mt-2" 
              onClick={() => {
                navigate();
                sonnerToast.dismiss(id);
              }}
            >
              See your friends
            </Button>
            <button 
              onClick={() => sonnerToast.dismiss(id)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <RxCross2 size={25} />
            </button>
          </div>
        ),
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
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "0.5rem 1rem",
          padding: "1rem",
          backgroundColor: "#efd0e8",
        },
        position: "bottom-right",
        action: (
          <div className="contents">
            <Button
              className="col-start-1 col-end-4 w-full mt-2" 
              onClick={() => {
                navigate();
                sonnerToast.dismiss(id);
              }}
            >
              Check your flashcard set
            </Button>
            <button 
              onClick={() => sonnerToast.dismiss(id)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <RxCross2 size={25} />
            </button>
          </div>
        ),
      }
    )
  },
  bookmark: ({title, description, navigate}: customToastProps) => {
    const id = sonnerToast(title,
      {
        icon: <BookmarkIcon />,
        description,
        duration: 6000,
        style: {
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "0.5rem 1rem",
          padding: "1rem",
          backgroundColor: "#efd0e8",
        },
        position: "bottom-right",
        action: (
          <div className="contents">
            <Button
              className="col-start-1 col-end-4 w-full mt-2" 
              onClick={() => {
                navigate();
                sonnerToast.dismiss(id);
              }}
            >
              Check your flashcard set
            </Button>
            <button 
              onClick={() => sonnerToast.dismiss(id)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <RxCross2 size={25} />
            </button>
          </div>
        ),
      }
    )
  },
  comment: ({ title, description, navigate }: customToastProps) => {
    const id = sonnerToast(title, {
      icon: <CommentIcon />,
      description,
      duration: 6000,
      style: {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto", 
        gap: "0.5rem 1rem",
        padding: "1rem",
        backgroundColor: "#efd0e8",
      },
      position: "bottom-right",
      action: (
        <div className="contents">
          <Button
            className="col-start-1 col-end-4 w-full mt-2" 
            onClick={() => {
              navigate();
              sonnerToast.dismiss(id);
            }}
          >
            See what they're saying
          </Button>
          <button 
            onClick={() => sonnerToast.dismiss(id)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            <RxCross2 size={25} />
          </button>
        </div>
      ),
    });
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