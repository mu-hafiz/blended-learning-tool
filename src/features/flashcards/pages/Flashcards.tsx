import { TextInput, PageContainer, Button, PopupContainer } from "@components";
import { FlashcardOverview } from "@components";
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
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    if (!user || !debouncedSearch.ready) return;

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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 lg:gap-0">
          <div className="flex flex-row items-center gap-2">
            <TextInput
              className="w-full sm:w-70"
              placeholder="Search Flashcard Sets"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/flashcards/create">
              <Button variant="success" className="gap-2 text-nowrap">
                Create Set
                <FaPlus />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <h3>Filters:</h3>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                className="whitespace-nowrap align-middle"
                onClick={() => setShowTagsPopup(true)}
              >
                  Set Search Tags{selectedTags.length > 0 && ` (${selectedTags.length})`}
              </Button>
              <Button
                className="flex flex-row items-center text-nowrap gap-2"
                variant={showCreated ? "success" : "danger"}
                onClick={() => setShowCreated(!showCreated)}
              >
                Created By You
                {showCreated
                  ? <LuPencil className="size-4" />
                  : <LuPencilOff className="size-4" />
                }
                
              </Button>
              <Button
                className="flex flex-row items-center text-nowrap gap-2"
                variant={showBookmarks ? "success" : "danger"}
                onClick={() => setShowBookmarks(!showBookmarks)}
              >
                Bookmarked
                {showBookmarks
                  ? <FaBookmark className="size-4" />
                  : <FaRegBookmark className="size-4" />
                }
              </Button>
              <Button
                className="flex flex-row items-center text-nowrap gap-2"
                variant={showLikes ? "success" : "danger"}
                onClick={() => setShowLikes(!showLikes)}
              >
                Liked
                {showLikes
                  ? <FaHeart className="size-4" />
                  : <FaRegHeart className="size-4" />
                }
              </Button>
            </div>
          </div>
        </div>
        <hr className="divider" />
        {displayedFlashcardSets.length > 0 ?
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
        sizeClassName="h-80"
      >
        <TagsPopup
          setTags={setSelectedTags}
          currentTags={selectedTags}
        />
      </PopupContainer>
    </>
  )
};

export default Flashcards;