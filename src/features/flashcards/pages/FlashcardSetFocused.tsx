import { useAuth } from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FlashcardSetsDB from "@lib/db/flashcardSets";
import { tryCatch } from "@utils/tryCatch";
import NotFound from "@pages/NotFound";
import { toast } from "@lib/toast";
import type { Flashcard, FlashcardSet } from "@models/tables";
import { useLoading } from "@providers/LoadingProvider";
import { PageContainer, PopupContainer, Tooltip } from "@components";
import Results from "../components/Results";
import { supabase } from "@lib/supabaseClient";
import FocusedView from "../components/FocusedView";
import ShufflePopup from "../components/ShufflePopup";
import { shuffleArray } from "@utils/shuffleArray";
import { FaArrowLeftLong } from "react-icons/fa6";

const FlashcardSetFocused = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { flashcardSetId } = useParams();
  const [flashcardSetInfo, setFlashcardSetInfo] = useState<FlashcardSet | null | undefined>(undefined);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null | undefined>(undefined);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | undefined>(undefined);
  const [flashcardNumber, setFlashcardNumber] = useState(1);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showShufflePopup, setShowShufflePopup] = useState(false);

  if (flashcardSetInfo === null) return <NotFound />;

  useEffect(() => {
    if (flashcardSetInfo !== undefined && flashcards !== undefined) {
      hideLoading();
    } else {
      showLoading("Fetching flashcards...");
    }

    return () => hideLoading();
  }, [flashcardSetInfo, flashcards]);

  useEffect(() => {
    if (!user) return;

    const fetchFlashcards = async () => {
      const { data, error } = await tryCatch(FlashcardSetsDB.getFlashcardSetWithFlashcards(flashcardSetId!));
      if (error) {
        toast.error("Could not fetch flashcards, please try again later");
        setFlashcardSetInfo(null);
        setFlashcards(null);
        return;
      }
      const { flashcards, ...info } = data;
      setFlashcardSetInfo(info);
      setFlashcards(flashcards);
    }

    fetchFlashcards();
  }, [user]);

  useEffect(() => {
    if (!flashcards) return;
    if (flashcards.length <= 0) {
      toast.error("There are no flashcards...");
      return;
    }
    setCurrentFlashcard(flashcards[flashcardNumber - 1]);
    console.log(flashcards);
  }, [flashcardNumber, flashcards]);

  const handleNextCard = ({ correct }: {correct: boolean}) => {
    setAnswers(prev => [...prev, correct]);
    if (flashcards && flashcardNumber < flashcards?.length) {
      setFlashcardNumber(prev => prev + 1);
    } else {
      handleResults([...answers, correct]);
    }
  };

  const handleUndo = () => {
    if (flashcardNumber > 1) {
      setFlashcardNumber(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const handleResults = async (finalAnswers: boolean[]) => {
    if (!user || !flashcardSetId || !flashcards) {
      toast.error("Could not submit results, please try again later");
      console.log("User, Flashcards or Flashcard Set ID are undefined");
    } else {
      showLoading("Submitting results...");
      const { data, error } = await supabase.rpc('submit_flashcard_results', {
        p_user_id: user.id,
        p_flashcard_set_id: flashcardSetId,
        p_total_cards: flashcards.length,
        p_correct_cards: finalAnswers.filter(Boolean).length
      });
      if (error) {
        toast.error("Could not submit results, please try again later");
      } else {
        setXpEarned(data);
      }
    }
    setShowResults(true);
    hideLoading();
  }

  const handleShuffle = (shuffle?: boolean) => {
    if (!shuffle) {
      setShowShufflePopup(true);
      return;
    }
    if (!flashcards) {
      toast.error("Could not load flashcards, please try again later");
      return;
    }
    setFlashcards(shuffleArray(flashcards));
    retry();
    setShowShufflePopup(false);
  }

  const retry = () => {
    setAnswers([]);
    setFlashcardNumber(1);
    setShowResults(false);
  }

  return (
    <>
      <PageContainer>
        <div className="grid grid-cols-[auto_1fr_auto] items-center w-full gap-4 pt-4">
          <div className="flex justify-start">
            <Tooltip position="bottom" text="Back to overview">
              <Link to={`/flashcards/${flashcardSetId}`}>
                <FaArrowLeftLong
                  className="cursor-pointer transition-transform duration-250 hover:-translate-x-1 size-8 lg:size-12"
                />
              </Link>
            </Tooltip>
          </div>

          <h1 className="text-center leading-tight line-clamp-2">
            {flashcardSetInfo?.title}
          </h1>

          <div className="size-8 lg:size-12 invisible" />
        </div>
        <div className="flex flex-col flex-1 items-center justify-center gap-5">
          {currentFlashcard && !showResults && (
            <FocusedView
              flashcardNumber={flashcardNumber}
              totalFlashcards={flashcards?.length ?? 0}
              currentFlashcard={currentFlashcard}
              handleNextCard={handleNextCard}
              handleUndo={handleUndo}
              handleShuffle={() => handleShuffle()}
            />
          )}
          {showResults && (
            <Results
              totalCards={flashcards?.length ?? 0}
              correctCards={answers.filter(Boolean).length}
              xpEarned={xpEarned}
              retry={retry}
            />
          )}
        </div>
      </PageContainer>
      <PopupContainer
        open={showShufflePopup}
        onClose={() => setShowShufflePopup(false)}
        sizeClassName="h-45 sm:h-45"
      >
        <ShufflePopup
          handleShuffle={() => handleShuffle(true)}
          onClose={() => setShowShufflePopup(false)}
        />
      </PopupContainer>
    </>
  )
};

export default FlashcardSetFocused;