import { useState, useEffect } from "react";
import type { StatisticsWithCourse } from "@models/tables";
import { Button } from "@components";
import { toast } from "@lib/toast";
import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";

const ProgressionStatistics = () => {
  const { accumulatedStatistics, allStatistics } = useOutletContext<ProgressionOutletContext>();
  const [displayStatistics, setDisplayStatistics] = useState<StatisticsWithCourse | Record<string, number> | null>(null);
  const [filterList, setFilterList] = useState<string[]>();
  const [filter, setFilter] = useState<string | null>("All");

  useEffect(() => {
    const courseCodes = allStatistics.map((row) => row.course?.code || null);
    const filterList = courseCodes.filter(code => code !== null);
    filterList.push('Misc.', 'All');

    setFilterList(filterList);
  }, [allStatistics]);

  useEffect(() => {
    
    if (filter === 'All') {
      accumulatedStatistics ? setDisplayStatistics(accumulatedStatistics) : null;
      return;
    }

    if (allStatistics.length === 0) return;
    const filteredStatistics = allStatistics.find((row) => {
      if (filter === null) return row.course === null;
      return row.course?.code === filter
    });
    if (!filteredStatistics) {
      toast.error('Something went wrong with the filter, please try again later');
    } else {
      setDisplayStatistics(filteredStatistics);
    }
  }, [filter, allStatistics, accumulatedStatistics]);

  return (
    <>
      <div className="flex">
        <Button className="min-w-20">{filter}</Button>
      </div>
      <h2 className="mt-5">Quizzes</h2>
      <hr className="divider"/>

      <h3>Quizzes Completed: {displayStatistics?.quizzes_completed || 0}</h3>
      <h3>Quizzes Perfected: {displayStatistics?.quizzes_perfected || 0}</h3>
      <h3>Quizzes Created: {displayStatistics?.quizzes_created || 0}</h3>
      <h3>Questions Correct: {displayStatistics?.questions_correct || 0}</h3>

      <h2 className="mt-5">Flashcards</h2>
      <hr className="divider"/>

      <h3>Flashcard Sets Completed: {displayStatistics?.flashcard_sets_completed || 0}</h3>
      <h3>Flashcard Sets Created: {displayStatistics?.flashcard_sets_created || 0}</h3>
      <h3>Flashcards Used: {displayStatistics?.flashcards_used || 0}</h3>
    </>
  );
};

export default ProgressionStatistics;