import { Avatar, Button, PageContainer, Tooltip } from "@components";
import { useEffect, useState } from "react";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart, FaBookReader, FaEyeSlash, FaShareAlt } from "react-icons/fa";
import { TbCardsFilled } from "react-icons/tb";
import FlashcardItem from "../components/FlashcardItem";
import { FaArrowLeftLong, FaArrowRightLong, FaPencil } from "react-icons/fa6";
import { handleLikeSingle, handleBookmarkSingle } from "../utils/flashcardActions";
import FlashcardLikesDB from "@lib/db/flashcardLikes";
import FlashcardBookmarksDB from "@lib/db/flashcardBookmarks";
import FlashcardSetsDB from "@lib/db/flashcardSets";
import FlashcardHistoryDB from "@lib/db/flashcardHistory";
import FlashcardCommentsDB from "@lib/db/flashcardComments";
import { useAuth } from "@providers/AuthProvider";
import { tryCatch } from "@utils/tryCatch";
import { Link, useParams } from "react-router-dom";
import { toast } from "@lib/toast";
import type { User, Flashcard, FlashcardSet as FlashcardSetRow, FlashcardHistory, FlashcardCommentWithUser } from "@models/tables";
import { useLoading } from "@providers/LoadingProvider";
import CommentSection from "../components/CommentSection";
import HistorySection from "../components/HistorySection";
import NotFound from "@pages/NotFound";
import formatDate from "../utils/formatDate";

const FlashcardSet = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { flashcardSetId } = useParams();
  const [flashcardSetInfo, setFlashcardSetInfo] = useState<FlashcardSetRow | null | undefined>(undefined);
  const [flashcardHistory, setFlashcardHistory] = useState<FlashcardHistory[] | null | undefined>(undefined);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null | undefined>(undefined);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | undefined>(undefined);
  const [comments, setComments] = useState<FlashcardCommentWithUser[] | null | undefined>(undefined);
  const [creator, setCreator] = useState<User | null | undefined>();
  const [flashcardNumber, setFlashcardNumber] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const mySet = user && flashcardSetInfo && user?.id === flashcardSetInfo?.creator_id;

  if (flashcardSetInfo === null) {
    return (
      <NotFound
        title="This flashcard set was too powerful..."
        description="Something went wrong, please try again later"
      />
    );
  };

  useEffect(() => {
    if (flashcardSetInfo !== undefined && flashcards !== undefined) {
      hideLoading();
    } else {
      showLoading("Fetching flashcards...");
    }

    return () => hideLoading();
  }, [flashcardSetInfo, flashcards]);

  useEffect(() => {
    if (!user) return;

    const checkBookmarked = async () => {
      const { data, error } = await tryCatch(FlashcardBookmarksDB.isFlashcardSetBookmarked(user.id, flashcardSetId!));
      if (error) {
        toast.error("Could not check bookmarked status, please try again later");
        return;
      };
      setBookmarked(data);
    }

    const checkLiked = async () => {
      const { data, error } = await tryCatch(FlashcardLikesDB.isFlashcardSetLiked(user.id, flashcardSetId!));
      if (error) {
        toast.error("Could not check liked status, please try again later");
        return;
      };
      setLiked(data);
    }

    const fetchFlashcards = async () => {
      const { data, error } = await tryCatch(FlashcardSetsDB.getFlashcardSetWithFlashcards(flashcardSetId!));
      if (error) {
        toast.error("Could not fetch flashcards, please try again later");
        setFlashcardSetInfo(null);
        setFlashcards(null);
        setCreator(null);
        return;
      }
      const { flashcards, creator, ...info } = data;
      setFlashcardSetInfo(info);
      setFlashcards(flashcards);
      setCreator(creator);
    }

    const fetchFlashcardHistory = async () => {
      const { data, error } = await tryCatch(FlashcardHistoryDB.getFlashcardHistory(user.id, flashcardSetId!));
      if (error) {
        toast.error("Could not fetch your history, please try again later");
        setFlashcardHistory(null);
        return;
      };
      setFlashcardHistory(data);
    };

    const fetchComments = async () => {
      const { data, error } = await tryCatch(FlashcardCommentsDB.getFlashcardComments(flashcardSetId!));
      if (error) {
        toast.error("Could not fetch comments, please try again later");
        setComments(null);
        return;
      };
      setComments(data);
    }

    checkBookmarked();
    checkLiked();
    fetchFlashcards();
    fetchFlashcardHistory();
    fetchComments();
  }, [user]);
  
  useEffect(() => {
    if (!flashcards) return;
    if (flashcards.length <= 0) {
      toast.error("There are no flashcards...");
      return;
    }
    setCurrentFlashcard(flashcards[flashcardNumber - 1]);
  }, [flashcardNumber, flashcards]);

  const nextCard = () => {
    if (!flashcardSetInfo) return;
    if (flashcardNumber >= flashcardSetInfo.num_of_flashcards) return;
    setFlashcardNumber(prev => prev + 1);
  };

  const previousCard = () => {
    if (flashcardNumber <= 1) return;
    setFlashcardNumber(prev => prev - 1);
  }

  const handleShare = async () => {
    const message = `Check out this flashcard set '${flashcardSetInfo?.title}' by ${creator?.username}\n\nwww.blendedlearningtool.app/flashcards/${flashcardSetId}`;
    try {
      await navigator.clipboard.writeText(message);
      console.log('Text copied to clipboard');
      toast.info("Copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.info("Could not share, please try again later");
    }
  };
  
  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between lg:gap-10 mb-5 lg:mb-2">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex flex-row gap-3 items-center">
            <Tooltip
              position="bottom"
              text="Back to flashcards"
            >
              <Link to="/flashcards">
                <FaArrowLeftLong
                  className="cursor-pointer transition-transform duration-250 hover:-translate-x-1 size-8 lg:size-12"
                />
              </Link>
            </Tooltip>
            <Link
              className="flex flex-row gap-2 w-fit min-w-0"
              to={`/profile/${creator?.username}`}
            >
              <Avatar
                filePath={creator?.profile_picture}
                size={30}
              />
              <h2 className="truncate">{creator?.username}</h2>
            </Link>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <h1>{flashcardSetInfo?.title}</h1>
            {flashcardSetInfo?.private && 
              <Tooltip
                position="top"
                text="Private to you"
                offset={15}
              >
                <FaEyeSlash size={30} />
              </Tooltip>
            }
          </div>
          <h3 className="line-clamp-3">{flashcardSetInfo?.description}</h3>
          <div className="flex flex-row gap-3 mt-2 mb-1">
            <div className="flex flex-row items-center gap-1">
              <TbCardsFilled size={25} />
              <h2>{flashcardSetInfo?.num_of_flashcards}</h2>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaBookmark size={22} />
              <h2>{flashcardSetInfo?.bookmarks}</h2>
            </div>
            <div className="flex flex-row items-center gap-1">
              <FaHeart size={25} color="red" />
              <h2>{flashcardSetInfo?.likes}</h2>
            </div>
          </div>
          <div className="flex gap-2 max-w-200 overflow-x-auto overflow-y-hidden mt-2 pb-2">
            {flashcardSetInfo?.tags.map(tag => (
              <p
                key={tag}
                className="bg-surface-tertiary px-2 py-1 rounded-full"
              >
                #{tag}
              </p>
            ))}
          </div>
          <p className="subtitle">Last Updated: {flashcardSetInfo?.updated_at && formatDate(flashcardSetInfo.updated_at)}</p>
        </div>
        <div className="flex flex-row flex-wrap justify-center lg:flex-col gap-4 lg:gap-4 mt-5">
          <div className="flex flex-row gap-2 justify-center">
            <Tooltip
              position="top"
              text="Share"
              offset={10}
            >
              <div
                className="cursor-pointer transition-transform ease-out duration-200 hover:-translate-y-0.5"
                onClick={() => handleShare()}
              >
                <FaShareAlt size={35} />
              </div>
            </Tooltip>
            <Tooltip
              position="top"
              text={bookmarked ? "Remove Bookmark" : "Bookmark Set"}
              offset={10}
            >
              <div
                className="cursor-pointer transition-transform ease-out duration-200 hover:-translate-y-0.5"
                onClick={() => handleBookmarkSingle(!bookmarked, flashcardSetId!, user, setBookmarked)}
              >
                {bookmarked ? <FaBookmark size={35} /> : <FaRegBookmark size={35} />}
              </div>
            </Tooltip>
            <Tooltip
              position="top"
              text={liked ? "Remove Like" : "Like Set"}
              offset={10}
            >
              <div
                className="cursor-pointer transition-transform ease-out duration-200 hover:-translate-y-0.5"
                onClick={() => handleLikeSingle(!liked, flashcardSetId!, user, setLiked)}
              >
                {liked ? <FaHeart size={35} color="red" /> : <FaRegHeart size={35} />}
              </div>
            </Tooltip>
          </div>
          <div className="flex flex-row lg:flex-col gap-2">
            <Link to={`/flashcards/${flashcardSetId}/focused`}>
              <Button className="gap-2 text-nowrap">
                <FaBookReader className="size-4 sm:size-5" />
                Study with this set!
              </Button>
            </Link>
            {mySet && (
              <Link to={`/flashcards/${flashcardSetId}/edit`}>
                <Button variant="secondary" className="gap-2 text-nowrap">
                  <FaPencil className="size-4 sm:size-5" />
                  Edit Set
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-3">
        <div className="flex flex-col gap-3 col-span-1 lg:col-span-2 lg:mx-6 xl:mx-10 items-center">
          {currentFlashcard && (
            <FlashcardItem
              flashcard={currentFlashcard}
              key={currentFlashcard.id}
            />
          )}
          <div className="flex flex-row items-center justify-center gap-6">
            <FaArrowLeftLong
              size={30}
              onClick={previousCard}
              className="cursor-pointer transition-transform duration-200 hover:-translate-x-0.5"
            />
            <h2>{flashcardNumber}/{flashcardSetInfo?.num_of_flashcards}</h2>
            <FaArrowRightLong
              size={30}
              onClick={nextCard}
              className="cursor-pointer transition-transform duration-200 hover:translate-x-0.5"
            />
          </div>
        </div>
        <hr className="divider lg:col-span-3 lg:hidden" />
        <HistorySection flashcardHistory={flashcardHistory} />
        <hr className="divider lg:col-span-3" />
      </div>
      <CommentSection
        comments={comments}
        flashcardSetId={flashcardSetId!}
        setComments={setComments}
      />
    </PageContainer>
  )
};

export default FlashcardSet;