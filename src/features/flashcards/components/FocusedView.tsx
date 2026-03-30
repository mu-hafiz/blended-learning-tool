import { Button } from "@components";
import FlashcardItem from "../components/FlashcardItem";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { LuUndo } from "react-icons/lu";
import { TbArrowsShuffle2 } from "react-icons/tb";
import type { Flashcard } from "@models/tables";

type FocusedViewProps = {
  flashcardNumber: number;
  totalFlashcards: number;
  currentFlashcard: Flashcard;
  handleNextCard: ({ correct }: { correct: boolean }) => void;
  handleUndo: () => void;
  handleShuffle: () => void;
}

const FocusedView = ({ flashcardNumber, totalFlashcards, currentFlashcard, handleNextCard, handleUndo, handleShuffle }: FocusedViewProps) => {
  return (
    <>
      <h2>{flashcardNumber}/{totalFlashcards}</h2>
      <div className="flex gap-5 items-center">
        <Button
          variant="danger"
          className="w-20 h-20 rounded-full"
          onClick={() => handleNextCard({ correct: false })}
        >
          <RxCross2 size={50} />
        </Button>
        <FlashcardItem
          flashcard={currentFlashcard}
          key={currentFlashcard.id}
        />
        <Button
          variant="success"
          className="w-20 h-20 rounded-full"
          onClick={() => handleNextCard({ correct: true })}
        >
          <FaCheck size={40} />
        </Button>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          variant="secondary"
          className="gap-2"
          onClick={handleUndo}
          disabled={flashcardNumber <= 1}
        >
          <LuUndo size={20} />
          Undo
        </Button>
        <Button
          variant="secondary"
          className="gap-2"
          onClick={handleShuffle}
        >
          <TbArrowsShuffle2 size={20} />
          Shuffle
        </Button>
      </div>
    </>
  )
};

export default FocusedView;