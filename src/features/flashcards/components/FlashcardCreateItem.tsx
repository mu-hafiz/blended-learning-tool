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
      <div className="flex flex-row flex-wrap lg:flex-nowrap items-center justify-center gap-3">
        <Button
          variant="danger"
          className="aspect-square h-fit order-2 lg:order-1"
          onClick={handleRemove}
          disabled={totalFlashcards <= 1}
        >
          <FaMinus className="size-3 sm:size-5" />
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 order-1 lg:order-2 min-w-0">
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
        <div className="flex flex-row lg:flex-col gap-2 order-3">
          <Button
            variant="secondary"
            className="aspect-square h-fit"
            onClick={() => handleReorder({ up: true })}
            disabled={friendlyIndex <= 1}
          >
            <FaArrowUp className="size-3 sm:size-5" />
          </Button>
          <Button
            variant="secondary"
            className="aspect-square h-fit"
            onClick={() => handleReorder({ up: false })}
            disabled={friendlyIndex >= totalFlashcards}
          >
            <FaArrowDown className="size-3 sm:size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default FlashcardCreateItem;