import { Button, PopupContainer, TextInput } from "@components";
import Comment from "./Comment";
import type { FlashcardCommentWithUser } from "@models/tables";
import { FaCommentSlash } from "react-icons/fa";
import { useMemo, useState } from "react";
import { toast } from "@lib/toast";
import FlashcardCommentsDB from "@lib/db/flashcardComments";
import { tryCatch } from "@utils/tryCatch";
import { useAuth } from "@providers/AuthProvider";
import DeleteCommentPopup from "./DeleteCommentPopup";

type CommentSectionProps = {
  comments: FlashcardCommentWithUser[] | null | undefined;
  flashcardSetId: string;
  setComments: React.Dispatch<React.SetStateAction<FlashcardCommentWithUser[] | null | undefined>>;
}

const CommentSection = ({ comments, flashcardSetId, setComments }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [replyComment, setReplyComment] = useState<FlashcardCommentWithUser | null>(null);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const sortedComments = useMemo(() => {
    if (!comments) return [];

    const result: FlashcardCommentWithUser[] = [];

    const commentsByParentId = comments ? Object.groupBy(comments, ({parent_id}) => parent_id ? parent_id : "_") : [];
    const parentComments = ((commentsByParentId as Record<string, FlashcardCommentWithUser[]>)["_"] || []).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    for (const parentComment of parentComments) {
      result.push(parentComment);
      const replies = ((commentsByParentId as Record<string, FlashcardCommentWithUser[]>)[parentComment.id] || []).sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      result.push(...replies);
    }

    return result;
  }, [comments]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Could not get your information, please try again later");
      console.log("User ID is undefined or null");
      return;
    }
    if (!comment) {
      toast.error("You have not entered a comment...");
      return;
    }

    const toastId = toast.loading("Creating comment...");

    const { data, error } = await tryCatch(FlashcardCommentsDB.createFlashcardComment(
      user.id,
      flashcardSetId,
      comment,
      replyComment ? (replyComment.parent_id !== null ? replyComment.parent_id : replyComment.id) : null,
      replyComment ? replyComment.user_id : null
    ));
    if (error) {
      toast.error("Could not submit comment, please try again later", { id: toastId });
      return;
    }
    setComments(prev => [...(prev ?? []), data]);
    setComment("");
    setReplyComment(null);
    toast.success("Comment created!", { id: toastId });
  };

  const handleDeleteWarning = (commentId: string) => {
    setCommentIdToDelete(commentId);
    setShowDeletePopup(true);
  }

  const handleDelete = async () => {
    setShowDeletePopup(false);
    
    if (!commentIdToDelete) {
      toast.error("Could not delete comment, please try again later");
      return;
    }

    const toastId = toast.loading("Deleting...");
    const { error } = await tryCatch(FlashcardCommentsDB.deleteFlashcardComment(commentIdToDelete));
    if (error) {
      toast.error("Could not delete comment, please try again later", { id: toastId });
      return;
    }

    setComments(prev => (prev ?? []).map(comment => {
      return comment.id === commentIdToDelete
        ? {...comment, deleted: true}
        : comment;
    }));
    toast.info("Comment deleted.", { id: toastId });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2>Comments</h2>
        <div className="flex flex-row items-center gap-2">
          <TextInput
            title={`Enter a comment${replyComment ? ` (replying to ${replyComment.user.username})` : ""}:`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant="secondary"
            disabled={!replyComment}
            onClick={() => setReplyComment(null)}
          >
            Stop Replying
          </Button>
          <Button
            disabled={comment.length <= 0}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
        <div className="flex flex-col gap-4 max-h-100 overflow-y-auto">
          {sortedComments.length > 0 ? 
            sortedComments.map(comment => (
              <Comment
                user={comment.user}
                replyToUser={comment.reply_to_user}
                date={comment.created_at}
                comment={comment.comment}
                replyAction={() => setReplyComment(comment)}
                ownsComment={user?.id === comment.user.user_id}
                deleteAction={() => handleDeleteWarning(comment.id)}
                deleted={comment.deleted}
                key={comment.id}
              />
            ))
          : 
            <div className="flex flex-col flex-1 items-center justify-center gap-2">
              <FaCommentSlash size={60} />
              <h2>Be the first to comment!</h2>
            </div>
          }
        </div>
      </div>
      <PopupContainer
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
      >
        <DeleteCommentPopup
          handleDelete={handleDelete}
          onClose={() => setShowDeletePopup(false)}
        />
      </PopupContainer>
    </>
  );
};

export default CommentSection;