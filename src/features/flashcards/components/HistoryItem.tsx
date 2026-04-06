import type { FlashcardHistory } from "@models/tables";
import formatDate from "../utils/formatDate";

const HistoryItem = ({ history }: { history: FlashcardHistory }) => {
  const date = formatDate(history.created_at);
  const percentage = history.total_cards === 0
    ? 0
    : (history.correct_cards / history.total_cards) * 100;
  return (
    <div className="flex flex-col gap-3 bg-surface-primary rounded-2xl p-4 shadow-md">
      <h3>{date}</h3>
      <div className="w-full bg-error rounded-full h-2">
        <div className="bg-success h-2 rounded-full" style={{ width: `${percentage}%`}}/>
      </div>
      <div className="flex flex-row items-center justify-evenly">
        <h3>{history.correct_cards}/{history.total_cards} correct</h3>
        <h3>+{history.xp_earned}XP</h3>
      </div>
    </div>
  );
};

export default HistoryItem;