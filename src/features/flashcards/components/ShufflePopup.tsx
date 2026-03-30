import { Button } from "@components";

const ShufflePopup = ({ handleShuffle, onClose }: { handleShuffle: () => void, onClose: () => void }) => {
  return (
    <>
      <h2 className="text-center mb-2">Are you sure you want to shuffle?</h2>
      <h3 className="text-center mb-5">Shuffling the set will reset your current progress!</h3>
      <div className="flex justify-center gap-2">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Go Back...
        </Button>
        <Button
          onClick={handleShuffle}
        >
          Shuffle!
        </Button>
      </div>
    </>
  );
};

export default ShufflePopup;