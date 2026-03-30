import { Button } from "@components";

const DeleteCommentPopup = ({ handleDelete, onClose }: { handleDelete: () => void, onClose: () => void }) => {
  return (
    <>
      <h2 className="text-center mb-2">Are you sure you want to delete your comment?</h2>
      <h3 className="text-center mb-5">Others will be able to see that you have deleted a comment.</h3>
      <div className="flex justify-center gap-2">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Go Back...
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
        >
          Delete Comment
        </Button>
      </div>
    </>
  );
}

export default DeleteCommentPopup;