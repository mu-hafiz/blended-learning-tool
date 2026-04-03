import { FlashcardOverview, PageContainer } from "@components";
import type { FlashcardSetWithUser } from "@models/tables";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { TbCards } from "react-icons/tb";
import { handleLike, handleBookmark } from "../../flashcards/utils/flashcardActions";
import { toast } from "@lib/toast";
import { tryCatch } from "@utils/tryCatch";
import FlashcardSetsDB from "@lib/db/flashcardSets";
import FlashcardLikesDB from "@lib/db/flashcardLikes";
import FlashcardBookmarksDB from "@lib/db/flashcardBookmarks";

const Dashboard = () => {
  const { user } = useAuth();
  const [latestSets, setLatestSets] = useState<FlashcardSetWithUser[]>([]);
  const [lastUsedSets, setLastUsedSets] = useState<FlashcardSetWithUser[]>([]);
  const [likedFlashcards, setLikedFlashcards] = useState<string[]>([]);
  const [bookmarkedFlashcards, setBookmarkedFlashcards] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchLatestSets = async () => {
      const { data, error } = await tryCatch(FlashcardSetsDB.getLatestPublicFlashcardSets(user.id));
      if (error) {
        toast.error("Could not get flashcard sets, please try again later");
        return;
      };
      setLatestSets(data);
    }

    const fetchLastUsedSets = async () => {
      const { data, error } = await tryCatch(FlashcardSetsDB.getLastUsedFlashcardSets(user.id));
      if (error) {
        toast.error("Could not get flashcard sets, please try again later");
        return;
      };
      setLastUsedSets(data);
    }

    const fetchLikedFlashcardSets = async () => {
      const { data, error } = await tryCatch(FlashcardLikesDB.getLikedFlashcardSets(user.id));
      if (error) {
        toast.error("Could not get flashcard sets, please try again later");
        return;
      };
      setLikedFlashcards(data);
    }

    const fetchBookmarkedFlashcardSets = async () => {
      const { data, error } = await tryCatch(FlashcardBookmarksDB.getBookmarkedFlashcardSets(user.id));
      if (error) {
        toast.error("Could not get flashcard sets, please try again later");
        return;
      };
      setBookmarkedFlashcards(data);
    }

    fetchLatestSets();
    fetchLastUsedSets();
    fetchLikedFlashcardSets();
    fetchBookmarkedFlashcardSets();
  }, [user]);

  return (
    <PageContainer title="Dashboard">
      <hr className="divider" />
      <div className="flex flex-col">
        <h2 className="mb-4">Last Used Flashcard Sets:</h2>
        {lastUsedSets.length > 0 ?
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {lastUsedSets.map(flashcardSet => {
              const liked = likedFlashcards.includes(flashcardSet.id);
              const bookmarked = bookmarkedFlashcards.includes(flashcardSet.id);
              return (
                <FlashcardOverview
                  flashcardSet={flashcardSet}
                  liked={liked}
                  bookmarked={bookmarked}
                  likeFunction={() => handleLike(!liked, flashcardSet.id, user, setLikedFlashcards)}
                  bookmarkFunction={() => handleBookmark(!bookmarked, flashcardSet.id, user, setBookmarkedFlashcards)}
                  key={flashcardSet.id}
                />
              );
            })}
          </ul>
        :
          <div className="flex flex-col items-center justify-center">
            <TbCards size={100}/>
            <h1 className="mt-5">Start studying!</h1>
          </div>
        }
        <hr className="divider" />
        <h2 className="mb-4">Discover New Flashcard Sets:</h2>
        {latestSets.length > 0 ?
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {latestSets.map(flashcardSet => {
              const liked = likedFlashcards.includes(flashcardSet.id);
              const bookmarked = bookmarkedFlashcards.includes(flashcardSet.id);
              return (
                <FlashcardOverview
                  flashcardSet={flashcardSet}
                  liked={liked}
                  bookmarked={bookmarked}
                  likeFunction={() => handleLike(!liked, flashcardSet.id, user, setLikedFlashcards)}
                  bookmarkFunction={() => handleBookmark(!bookmarked, flashcardSet.id, user, setBookmarkedFlashcards)}
                  key={flashcardSet.id}
                />
              );
            })}
          </ul>
        :
          <div className="flex flex-col flex-1 items-center justify-center">
            <TbCards size={100}/>
            <h1 className="mt-5">No recent sets...</h1>
          </div>
        }
      </div>
    </PageContainer>
  );
}

export default Dashboard;