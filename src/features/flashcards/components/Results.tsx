import { Button } from "@components";

type ResultsProps = {
  totalCards: number;
  correctCards: number;
  xpEarned: number;
  retry: () => void;
}

const Results = ({ totalCards, correctCards, xpEarned, retry }: ResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-surface-primary rounded-2xl p-10">
      <h1>Results</h1>
      <h2 className="mt-4">You Got {correctCards}/{totalCards} correct!</h2>
      <h3 className="mb-6">+{xpEarned}XP gained!</h3>
      <Button
        onClick={retry}
      >
        Retry?
      </Button>
    </div>
  )
};

export default Results;