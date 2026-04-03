import { RxChevronRight } from "react-icons/rx";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { TbCardsFilled } from "react-icons/tb";
import { Avatar, Tooltip } from "@components";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import type { FlashcardSetWithUser } from "@models/tables";

type FlashcardOverviewProps = {
  flashcardSet: FlashcardSetWithUser;
  liked: boolean;
  bookmarked: boolean;
  likeFunction: () => void;
  bookmarkFunction: () => void;
}

const FlashcardOverview = ({ flashcardSet, liked, bookmarked, likeFunction, bookmarkFunction }: FlashcardOverviewProps) => {
  return (
    <div className="relative h-50 bg-surface-secondary rounded-2xl p-3">

      <div className="flex justify-between">
        <Link
          className="flex items-center gap-2 w-fit min-w-0"
          to={`/profile/${flashcardSet.creator.username}`}
        >
          <Avatar
            filePath={flashcardSet.creator.profile_picture}
            size={25}
          />
          <h3 className="truncate">wwwwwwwwwwwwwww{flashcardSet.creator.username}</h3>
        </Link>
        <div className="flex gap-1 ml-3">
          {flashcardSet.private && 
            <Tooltip
              position="top"
              text="Private to you"
              offset={15}
            >
              <FaEyeSlash size={25} />
            </Tooltip>
          }
          <div className="cursor-pointer transition-transform ease-out duration-200 hover:-translate-y-0.5" onClick={bookmarkFunction}>
            {bookmarked ? <FaBookmark size={25} /> : <FaRegBookmark size={25} />}
          </div>
          <div className="cursor-pointer transition-transform ease-out duration-200 hover:-translate-y-0.5" onClick={likeFunction}>
            {liked ? <FaHeart size={25} color="red" /> : <FaRegHeart size={25} />}
          </div>
        </div>
      </div>

      <div className="pr-12">
        <h2 className="truncate mt-2">{flashcardSet.title}</h2>
        <p className="mt-1 line-clamp-2">{flashcardSet.description}</p>
      </div>
      
      <div className="absolute bottom-3 left-3 right-50">
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1">
          {flashcardSet.tags.map(tag => (
            <p
              key={tag}
              className="bg-surface-tertiary px-2 py-1 rounded-full"
            >
              #{tag}
            </p>
          ))}
        </div>
      </div>

      <Link
        className="absolute top-1/2 -translate-y-1/2 right-0 transition-transform hover:translate-x-1 ease-out duration-200"
        to={`/flashcards/${flashcardSet.id}`}
      >
        <RxChevronRight size={50} />
      </Link>

      <div className="absolute flex flex-col bottom-3 right-3">
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-row items-center gap-1">
            <TbCardsFilled className="size-5 sm:size-6" />
            <h3>{flashcardSet.num_of_flashcards}</h3>
          </div>
          <div className="flex flex-row items-center gap-1">
            <FaBookmark className="size-4 sm:size-5" />
            <h3>{flashcardSet.bookmarks}</h3>
          </div>
          <div className="flex flex-row items-center gap-1">
            <FaHeart className="size-4 sm:size-5" color="red" />
            <h3>{flashcardSet.likes}</h3>
          </div>
        </div>
        <p className="subtitle">Last Updated: {new Date(flashcardSet.updated_at).toLocaleDateString()}</p>
      </div>
      
    </div>
  );
};

export default FlashcardOverview;