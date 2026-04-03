import { GiBackwardTime } from "react-icons/gi";
import { MdTimeline } from "react-icons/md";
import HistoryItem from "./HistoryItem";
import type { FlashcardHistory } from "@models/tables";

type HistorySectionProps = {
  flashcardHistory: FlashcardHistory[] | null | undefined;
}

const HistorySection = ({ flashcardHistory }: HistorySectionProps) => (
  <div className="flex flex-col mb-5 lg:mb-0">
    <div className="flex flex-row gap-3 items-center justify-center mb-3">
      <MdTimeline size={40} />
      <h2>Your Previous Attempts:</h2>
    </div>
    <div className="flex flex-col gap-6 h-auto max-h-90 sm:max-h-97 lg:h-90 overflow-y-auto px-3">
      {flashcardHistory && flashcardHistory?.length <= 0 ?
        <div className="flex flex-col flex-1 items-center justify-center">
          <GiBackwardTime size={80} />
          <h2>Start studying!</h2>
        </div>
        : 
        flashcardHistory?.map(history => (
          <HistoryItem
            history={history}
            key={history.id}
          />
        ))}
    </div>
  </div>
);

export default HistorySection;