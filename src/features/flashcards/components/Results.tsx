import { Button } from "@components";

type ResultsProps = {
  totalCards: number;
  correctCards: number;
  xpEarned: number;
  retry: () => void;
}

const Results = ({ totalCards, correctCards, xpEarned, retry }: ResultsProps) => {
  return (
    <>
      <h1>Results</h1>
      <h2>You Got {correctCards}/{totalCards} correct!</h2>
      <h3>+{xpEarned}XP</h3>
      <Button
        onClick={retry}
      >
        Retry?
      </Button>
    </>
  )
};

export default Results;