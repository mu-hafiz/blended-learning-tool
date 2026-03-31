import { Button, RHFTextInput } from "@components";
import { FaMinus } from "react-icons/fa";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import type { Control } from "react-hook-form";
import type { FlashcardSetValues } from "../types/formSchemas";

type FlashcardCreateProps = {
  index: number;
  control: Control<FlashcardSetValues>;
  handleRemove: () => void;
  handleReorder: ({ up }: { up: boolean }) => void;
  totalFlashcards: number;
};

const FlashcardCreateItem = ({ index, control, handleRemove, handleReorder, totalFlashcards }: FlashcardCreateProps) => {
  const friendlyIndex = index + 1;
  return (
    <div className="flex flex-col gap-2">
      <h2>Flashcard #{friendlyIndex}</h2>
      <div className="flex flex-row items-center gap-3">
        <Button
          variant="danger"
          className="aspect-square h-fit"
          onClick={handleRemove}
          disabled={totalFlashcards <= 1}
        >
          <FaMinus size={20} />
        </Button>
        <div className="grid grid-cols-2 w-full gap-3">
          <RHFTextInput
            name={`flashcards.${index}.front`}
            control={control}
            placeholder="Enter Question"
            title="Front (Question)"
            multiline
          />
          <RHFTextInput
            name={`flashcards.${index}.back`}
            control={control}
            placeholder="Enter Answer"
            title="Back (Answer)"
            multiline
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            className="aspect-square h-fit"
            onClick={() => handleReorder({ up: true })}
            disabled={friendlyIndex <= 1}
          >
            <FaArrowUp size={20} />
          </Button>
          <Button
            variant="secondary"
            className="aspect-square h-fit"
            onClick={() => handleReorder({ up: false })}
            disabled={friendlyIndex >= totalFlashcards}
          >
            <FaArrowDown size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default FlashcardCreateItem;