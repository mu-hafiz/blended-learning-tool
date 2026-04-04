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
  <div className="flex flex-row gap-2 w-full min-w-0">
    <div className="border-surface-tertiary border-l-2 border-b-2 w-10 h-10 rounded-bl-2xl shrink-0"/>
    <div className="flex-1 min-w-0">
      {children}
    </div>
  </div>
);

const CommentBase = ({ user, replyToUser, date, comment, replyAction, ownsComment, deleteAction, deleted }: CommentProps ) => {
  const formattedDate = formatDate(date);
  return (
    <div className="bg-surface-primary rounded-2xl w-full md:w-fit md:max-w-[100%] h-fit p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-3 min-w-0">
          <Link
            className="flex flex-row items-center gap-2 min-w-0"
            to={`/profile/${user.username}`}
          >
            <Avatar
              filePath={user.profile_picture}
              size={20}
            />
            <h3 className="truncate">{user.username}</h3>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2 ml-1 shrink-0">
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
              align="left"
            >
              <RxCross2
                size={20}
                className="text-error-text cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
                onClick={deleteAction}
              />
            </Tooltip>
          )}
        </div>
      </div>
      {replyToUser && (
        <div className="flex flex-row gap-1.5 mt-1">
          <p className="subtitle text-nowrap">Replying to</p>
          <Link
            className="flex flex-row items-center gap-1 min-w-0"
            to={`/profile/${replyToUser.username}`}
          >
            <Avatar
              filePath={replyToUser.profile_picture}
              size={15}
            />
            <p className="subtitle truncate">{replyToUser.username}</p>
          </Link>
        </div>
      )}
      {!deleted
        ? <p className="mt-2 break-words whitespace-pre-wrap">{comment}</p>
        : <p className="mt-2 italic">This comment has been deleted</p>
      }
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