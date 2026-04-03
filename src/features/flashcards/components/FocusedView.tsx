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
    <div className="flex flex-col items-center gap-3 w-full">

      <h1>{flashcardNumber}/{totalFlashcards}</h1>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-10 items-center justify-center w-full">
        <div className="flex justify-center w-full max-w-3xl md:order-2">
          <FlashcardItem
            flashcard={currentFlashcard}
            key={currentFlashcard.id}
          />
        </div>
        <div className="flex flex-row md:contents gap-4">
          <Button
            variant="danger"
            className="w-20 h-20 rounded-full shrink-0 md:order-1"
            onClick={() => handleNextCard({ correct: false })}
          >
            <RxCross2 size={50} />
          </Button>
          <Button
            variant="success"
            className="w-20 h-20 rounded-full shrink-0 md:order-3"
            onClick={() => handleNextCard({ correct: true })}
          >
            <FaCheck size={40} />
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-2 mt-4">
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

    </div>
  )
};

export default FocusedView;