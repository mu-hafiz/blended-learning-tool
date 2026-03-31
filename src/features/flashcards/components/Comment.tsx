import { Avatar, Tooltip } from "@components";
import type { User } from "@models/tables";
import { HiReply } from "react-icons/hi";
import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";
import { RxCross2 } from "react-icons/rx";

type CommentProps = {
  user: User;
  replyToUser: undefined | null;
  date: string;
  comment: string;
  replyAction: () => void;
  deleteAction: () => void;
  ownsComment: boolean;
  deleted: boolean;
} | {
  user: User;
  replyToUser: User;
  date: string;
  comment: string;
  replyAction: () => void;
  deleteAction: () => void;
  ownsComment: boolean;
  deleted: boolean;
}

const ReplyWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row gap-2">
    <div className="border-surface-tertiary border-l-2 border-b-2 w-10 h-10 rounded-bl-2xl"/>
    {children}
  </div>
);

const CommentBase = ({ user, replyToUser, date, comment, replyAction, ownsComment, deleteAction, deleted }: CommentProps ) => {
  const formattedDate = formatDate(date);
  return (
    <div className="bg-surface-primary rounded-2xl min-w-150 w-fit h-fit p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-3">
          <Link
            className="flex flex-row items-center gap-2"
            to={`/profile/${user.username}`}
          >
            <Avatar
              filePath={user.profile_picture}
              size={20}
            />
            <h3>{user.username}</h3>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="subtitle">{formattedDate}</p>
          {!deleted && (
            <Tooltip
              position="bottom"
              text="Reply"
            >
              <HiReply
                size={20}
                className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
                onClick={replyAction}
              />
            </Tooltip>
          )}
          {ownsComment && !deleted && (
            <Tooltip
              position="bottom"
              text="Delete Comment"
            >
              <RxCross2
                size={20}
                className="text-error cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
                onClick={deleteAction}
              />
            </Tooltip>
          )}
        </div>
      </div>
      {replyToUser && (
        <div className="flex flex-row gap-1.5">
          <p className="subtitle">Replying to</p>
          <Link
            className="flex flex-row items-center gap-1"
            to={`/profile/${replyToUser.username}`}
          >
            <Avatar
              filePath={replyToUser.profile_picture}
              size={15}
            />
            <p className="subtitle">{replyToUser.username}</p>
          </Link>
        </div>
      )}
      {!deleted ? <p className="mt-2">{comment}</p> : <p className="mt-2 italic">This comment has been deleted</p>}
    </div>
  );
};

const Comment = ({ user, replyToUser, date, comment, replyAction, ownsComment, deleteAction, deleted }: CommentProps) => {
  if (replyToUser) {
    return (
      <ReplyWrapper>
        <CommentBase
          user={user}
          replyToUser={replyToUser}
          date={date}
          comment={comment}
          replyAction={replyAction}
          ownsComment={ownsComment}
          deleteAction={deleteAction}
          deleted={deleted}
        />
      </ReplyWrapper>
    )
  }
  return (
    <CommentBase
      user={user}
      replyToUser={null}
      date={date}
      comment={comment}
      replyAction={replyAction}
      ownsComment={ownsComment}
      deleteAction={deleteAction}
      deleted={deleted}
    />
  );
};

export default Comment;