import { Button } from "@components";
import FlashcardItem from "../components/FlashcardItem";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { LuUndo } from "react-icons/lu";
import { TbArrowsShuffle2 } from "react-icons/tb";
import type { Flashcard } from "@models/tables";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type FocusedViewProps = {
  flashcardNumber: number;
  totalFlashcards: number;
  currentFlashcard: Flashcard;
  handleNextCard: ({ correct }: { correct: boolean }) => void;
  handleUndo: () => void;
  handleShuffle: () => void;
}

const FocusedView = ({ flashcardNumber, totalFlashcards, currentFlashcard, handleNextCard, handleUndo, handleShuffle }: FocusedViewProps) => {
  const cardRef = useRef<{ flip: () => void }>(null);
  const [correctPressed, setCorrectPressed] = useState(false);
  const [incorrectPressed, setIncorrectPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          handleNextCardBuffer({ correct: false });
          break;
        case 'ArrowRight':
          handleNextCardBuffer({ correct: true });
          break;
        case ' ':
        case 'Enter':
          cardRef.current?.flip();
          event.preventDefault();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextCard]);

  const handleNextCardBuffer = ({ correct }: { correct: boolean }) => {
    handleNextCard({ correct });
    if (correct) {
      setCorrectPressed(true);
      setTimeout(() => setCorrectPressed(false), 1000);
    } else {
      setIncorrectPressed(true);
      setTimeout(() => setIncorrectPressed(false), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">

      <h1>{flashcardNumber}/{totalFlashcards}</h1>

      <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full max-w-3xl md:order-2">
          <FlashcardItem
            flashcard={currentFlashcard}
            key={currentFlashcard.id}
            ref={cardRef}
          />
          <h3 className="hidden md:block">Space Bar/Enter to Flip</h3>
        </div>
        <div className="flex flex-row md:contents gap-4">
          <div className="flex flex-col items-center gap-2 shrink-0 md:order-1">
            <div className="relative size-20">
              <div className={twMerge(
                "absolute inset-0 bg-error rounded-full",
                incorrectPressed ? "animate-ping" : ""
              )}/>
              <Button
                variant="danger"
                className="absolute inset-0 size-20 rounded-full"
                onClick={() => handleNextCardBuffer({ correct: false })}
              >
                <RxCross2 size={50} />
              </Button>
            </div>
            <h3 className="hidden md:block">Left Arrow Key</h3>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0 md:order-3">
            <div className="relative size-20">
              <div className={twMerge(
                "absolute inset-0 bg-success rounded-full",
                correctPressed ? "animate-ping" : ""
              )}/>
              <Button
                variant="success"
                className="absolute inset-0 size-20 rounded-full"
                onClick={() => handleNextCardBuffer({ correct: true })}
              >
                <FaCheck size={40} />
              </Button>
            </div>
            <h3 className="hidden md:block">Right Arrow Key</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-4">
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