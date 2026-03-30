import { TextInput, PageContainer, Button, PopupContainer } from "@components";
import FlashcardOverview from "../components/FlashcardOverview";
import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { LuPencil, LuPencilOff } from "react-icons/lu";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TbCards } from "react-icons/tb";
import FlashcardSetsDB from "@lib/db/flashcardSets";
import FlashcardLikesDB from "@lib/db/flashcardLikes";
import FlashcardBookmarksDB from "@lib/db/flashcardBookmarks";
import { useAuth } from "@providers/AuthProvider";
import type { FlashcardSetWithUser } from "@models/tables";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";
import { useDebounce } from "@hooks/useDebounce";
import TagsPopup from "../components/TagsPopup";
import { handleLike, handleBookmark } from "../utils/flashcardActions";

const Flashcards = () => {
  const { user } = useAuth();

  const [allFlashcardSets, setAllFlashcardSets] = useState<FlashcardSetWithUser[]>([]);
  const [displayedFlashcardSets, setDisplayedFlashcardSets] = useState<FlashcardSetWithUser[]>([]);
  const [likedFlashcards, setLikedFlashcards] = useState<string[]>([]);
  const [bookmarkedFlashcards, setBookmarkedFlashcards] = useState<string[]>([]);
  const [showCreated, setShowCreated] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [search, setSearch] = useState("");
  const [showTagsPopup, setShowTagsPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (!user) return;

    const fetchFlashcardSets = async () => {
      const { data, error } = await tryCatch(FlashcardSetsDB.getAllPublicFlashcardSets(user.id));
      if (error) {
        toast.error("Could not get flashcard sets, please try again later");
        return;
      };
      setAllFlashcardSets(data);
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

    fetchFlashcardSets();
    fetchLikedFlashcardSets();
    fetchBookmarkedFlashcardSets();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    var flashcards = allFlashcardSets;
    if (debouncedSearch.ready) {
      flashcards = flashcards.filter(f => f.title.toLowerCase().includes(debouncedSearch.value.toLowerCase()));
    }
    if (showCreated) {
      flashcards = flashcards.filter(f => f.creator_id === user.id);
    }
    if (showBookmarks) {
      flashcards = flashcards.filter(f => bookmarkedFlashcards.includes(f.id));
    }
    if (showLikes) {
      flashcards = flashcards.filter(f => likedFlashcards.includes(f.id));
    }
    if (selectedTags.length > 0) {
      flashcards = flashcards.filter(f => selectedTags.some(t => f.tags.includes(t)));
    }
    setDisplayedFlashcardSets(flashcards);
  }, [user, allFlashcardSets, showCreated, showBookmarks, showLikes, debouncedSearch, selectedTags]);

  return (
    <>
      <PageContainer title="Flashcards">
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <TextInput
              className="w-50"
              placeholder="Search Flashcard Sets"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="whitespace-nowrap align-middle"
              onClick={() => setShowTagsPopup(true)}
            >
                Select Tags{selectedTags.length > 0 && ` (${selectedTags.length})`}
            </Button>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              className="flex flex-row items-center text-nowrap"
              variant={showCreated ? "success" : "danger"}
              onClick={() => setShowCreated(!showCreated)}
            >
              Created By You
              {showCreated
                ? <LuPencil size={20} className="ml-2" />
                : <LuPencilOff size={20} className="ml-2" />
              }
              
            </Button>
            <Button
              className="flex flex-row items-center text-nowrap"
              variant={showBookmarks ? "success" : "danger"}
              onClick={() => setShowBookmarks(!showBookmarks)}
            >
              Bookmarked
              {showBookmarks
                ? <FaBookmark size={15} className="ml-2" />
                : <FaRegBookmark size={15} className="ml-2" />
              }
            </Button>
            <Button
              className="flex flex-row items-center text-nowrap"
              variant={showLikes ? "success" : "danger"}
              onClick={() => setShowLikes(!showLikes)}
            >
              Liked
              {showLikes
                ? <FaHeart size={15} className="ml-2" />
                : <FaRegHeart size={15} className="ml-2" />
              }
            </Button>
          </div>
        </div>
        <hr className="divider" />
        {displayedFlashcardSets.length > 0 ?
          <ul className="grid grid-cols-3 gap-5">
            {displayedFlashcardSets.map(flashcardSet => {
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
            <h1 className="mt-5">No matching flashcard sets...</h1>
          </div>
        }
      </PageContainer>
      <PopupContainer
        open={showTagsPopup}
        onClose={() => setShowTagsPopup(false)}
      >
        <TagsPopup
          setSearchTags={setSelectedTags}
        />
      </PopupContainer>
    </>
  )
};

export default Flashcards;