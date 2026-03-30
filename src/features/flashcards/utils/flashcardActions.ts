import { toast } from "@lib/toast";
import { tryCatch } from "@utils/tryCatch";
import FlashcardLikesDB from "@lib/db/flashcardLikes";
import FlashcardBookmarksDB from "@lib/db/flashcardBookmarks";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export const handleLike = async (
  like: boolean,
  flashcardSetId: string,
  user: SupabaseUser | null | undefined,
  updateLikedFlashcards: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const toastId = toast.loading("Working on it...");
  if (!user) {
    toast.error("Could not load your account, please try again later", { id: toastId });
    console.log("User ID is null/undefined");
    return;
  }
  if (like) {
    const { error } = await tryCatch(FlashcardLikesDB.likeFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not like flashcard set, please try again later", { id: toastId });
      return;
    };
    updateLikedFlashcards(prev => [...prev, flashcardSetId]);
  } else {
    const { error } = await tryCatch(FlashcardLikesDB.unlikeFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not unlike flashcard set, please try again later", { id: toastId });
      return;
    };
    updateLikedFlashcards(prev => prev.filter(f => f !== flashcardSetId));
  }
  toast.info(like ? "Liked!" : "Removed Like", { id: toastId });
}

export const handleLikeSingle = async (
  like: boolean,
  flashcardSetId: string,
  user: SupabaseUser | null | undefined,
  updateLiked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const toastId = toast.loading("Working on it...");
  if (!user) {
    toast.error("Could not load your account, please try again later", { id: toastId });
    console.log("User ID is null/undefined");
    return;
  }
  if (like) {
    const { error } = await tryCatch(FlashcardLikesDB.likeFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not like flashcard set, please try again later", { id: toastId });
      return;
    };
    updateLiked(true);
  } else {
    const { error } = await tryCatch(FlashcardLikesDB.unlikeFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not unlike flashcard set, please try again later", { id: toastId });
      return;
    };
    updateLiked(false);
  }
  toast.info(like ? "Liked!" : "Removed Like", { id: toastId });
}


export const handleBookmark = async (
  bookmark: boolean,
  flashcardSetId: string,
  user: SupabaseUser | null | undefined,
  updateBookmarkedFlashcards: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const toastId = toast.loading("Working on it...");
  if (!user) {
    toast.error("Could not load your account, please try again later", { id: toastId });
    console.log("User ID is null/undefined");
    return;
  }
  if (bookmark) {
    const { error } = await tryCatch(FlashcardBookmarksDB.bookmarkFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not bookmark flashcard set, please try again later", { id: toastId });
      return;
    };
    updateBookmarkedFlashcards(prev => [...prev, flashcardSetId]);
  } else {
    const { error } = await tryCatch(FlashcardBookmarksDB.removeBookmarkFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not remove bookmark for flashcard set, please try again later", { id: toastId });
      return;
    };
    updateBookmarkedFlashcards(prev => prev.filter(f => f !== flashcardSetId));
  }
  toast.info(bookmark ? "Bookmarked!" : "Removed Bookmark", { id: toastId });
}

export const handleBookmarkSingle = async (
  bookmark: boolean,
  flashcardSetId: string,
  user: SupabaseUser | null | undefined,
  updateBookmarked: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const toastId = toast.loading("Working on it...");
  if (!user) {
    toast.error("Could not load your account, please try again later", { id: toastId });
    console.log("User ID is null/undefined");
    return;
  }
  if (bookmark) {
    const { error } = await tryCatch(FlashcardBookmarksDB.bookmarkFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not bookmark flashcard set, please try again later", { id: toastId });
      return;
    };
    updateBookmarked(true);
  } else {
    const { error } = await tryCatch(FlashcardBookmarksDB.removeBookmarkFlashcardSet(user.id, flashcardSetId));
    if (error) {
      toast.error("Could not remove bookmark for flashcard set, please try again later", { id: toastId });
      return;
    };
    updateBookmarked(false);
  }
  toast.info(bookmark ? "Bookmarked!" : "Removed Bookmark", { id: toastId });
}