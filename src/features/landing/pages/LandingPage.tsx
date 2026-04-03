import { ThemeItem } from '@components';
import AchievementItem from '@components/AchievementItem';
import Button from '@components/Button';
import FlashcardItem from '@features/flashcards/components/FlashcardItem';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="container 2xl:max-w-screen-xl">
        <div className="flex flex-col items-center justify-center">
          <h1>A Blended Learning Tool</h1>
          <h2 className='text-center mt-2 mb-4'>A collaborative platform, encouraging gamification and building habits!</h2>
          <div className='flex flex-row gap-2 justify-center mb-10'>
            <Button
              variant="secondary"
              className="w-30"
              onClick={() => navigate("/account/login")}
            >
              Login
            </Button>
            <Button
              variant="primary"
              className="w-30"
              onClick={() => navigate("/account/signup")}
            >
              Sign Up
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-3 items-center bg-surface-primary rounded-2xl p-6">
              <h1>Flashcards</h1>
              <h3 className="text-center mb-2">Create and share your own flashcards, add comments to support one another, and keep track of your history with each flashcard set you use!</h3>
              <FlashcardItem
                flashcard={{
                  front: "What is the answer to this flashcard? 🤔",
                  back: "Got you 🤣",
                  flashcard_set_id: "",
                  id: "",
                  order: 0
                }}
                className='bg-surface-tertiary'
              />
            </div>
            <div className="flex flex-col gap-3 items-center bg-surface-primary rounded-2xl p-4">
              <h1>Gamifying Studying</h1>
              <h3 className="text-center mb-2">Study to the next level! Compete in the leaderboards, unlock achievements, and progress through the levels. Can you earn the rarest achievements?</h3>
              <div className='flex flex-col w-full gap-3'>
                <AchievementItem
                  title="The Start of Something New"
                  description="Use 100 flashcards"
                  percentage="75"
                  xp={100}
                />
                <AchievementItem
                  title="A Bustling Community"
                  description="Befriend 5 people"
                  percentage="20"
                  xp={500}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 items-center bg-surface-primary rounded-2xl p-4">
              <h1>Building a community</h1>
              <h3 className="text-center">Express yourself with unlockable themes, explore and make friends, and share your accomplishments!</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
