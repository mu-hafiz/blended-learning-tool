import type { Flashcard } from "@models/tables";
import { useState } from "react";

const FlashcardItem = ({ flashcard }: { flashcard: Flashcard }) => {
  const [showFront, setShowFront] = useState(true);

  return (
    <div
      className="w-180 h-100 perspective cursor-pointer"
      onClick={() => setShowFront(prev => !prev)}
    >
      <div
        className={`
          relative w-full h-full bg-surface-primary rounded-4xl flex items-center justify-center align-middle
          transition-transform duration-500 [transform-style:preserve-3d] ${!showFront ? "[transform:rotateY(180deg)]" : ""}
        `}
      >
        <div className="absolute w-full h-full bg-surface-primary rounded-4xl flex items-center justify-center [backface-visibility:hidden]">
          <h1>{flashcard.front}</h1>
        </div>
        <div className="absolute w-full h-full bg-surface-primary rounded-4xl flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h1>{flashcard.back}</h1>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;