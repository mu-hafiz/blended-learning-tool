import type { Flashcard } from "@models/tables";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const FlashcardText = ({ text }: { text: string }) => {
  if (text.length >= 200) {
    return <h3 className="text-center max-h-full overflow-y-auto">{text}</h3>;
  } else if (text.length >= 100) {
    return <h2 className="text-center">{text}</h2>;
  } else {
    return <h1 className="text-center leading-8">{text}</h1>;
  }
}

const FlashcardItem = ({ flashcard, className }: { flashcard: Flashcard, className?: string }) => {
  const [showFront, setShowFront] = useState(true);

  return (
    <div
      className="aspect-[7/5] sm:aspect-[9/5] w-full max-w-120 sm:max-w-none perspective cursor-pointer"
      onClick={() => setShowFront(prev => !prev)}
    >
      <div
        className={twMerge(`
          relative w-full h-full bg-surface-secondary rounded-4xl flex items-center justify-center align-middle
          transition-transform duration-500 [transform-style:preserve-3d]`,
          !showFront ? "[transform:rotateY(180deg)]" : "",
          className
        )}
      >
        <div className={twMerge("absolute w-full h-full p-4 bg-surface-secondary rounded-4xl flex items-center justify-center [backface-visibility:hidden] whitespace-pre-wrap shadow-lg", className)}>
          <FlashcardText text={flashcard.front} />
        </div>
        <div className={twMerge("absolute w-full h-full p-4 bg-surface-secondary rounded-4xl flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] whitespace-pre-wrap shadow-lg", className)}>
          <FlashcardText text={flashcard.back} />
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;