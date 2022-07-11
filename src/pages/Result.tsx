import { FC, useEffect, useState } from "react";
import { PAGE, usePage } from "../hooks/usePage";
import { GRADE } from "./Game";
import { ChartSquareBarIcon, StarIcon } from "@heroicons/react/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/outline";
import { getHighestScore, saveScoreIfHighest } from "../utils/utils";
import { TweetButton } from "../components/TweetButton";
import { LeaderBoard } from "../components/LeaderBoard";

const getMostfrequentGrade = (grades: number[]) => {
  const gradeMode = grades.reduce(
    (a, b) =>
      grades.filter((v) => v === a).length >=
      grades.filter((v) => v === b).length
        ? a
        : b,
    999
  );
  return gradeMode;
};

const Stars = (grade: GRADE) => {
  if (grade === GRADE.BAD) {
    return (
      <>
        <OutlineStarIcon
          className="h-16 w-16 text-yellow-500"
          strokeWidth={0.2}
        />
        <OutlineStarIcon
          className="h-16 w-16 text-yellow-500"
          strokeWidth={0.2}
        />
        <OutlineStarIcon
          className="h-16 w-16 text-yellow-500"
          strokeWidth={0.2}
        />
      </>
    );
  } else if (grade === GRADE.GOOD) {
    return (
      <>
        <StarIcon className="h-16 w-16 text-yellow-300" />
        <OutlineStarIcon
          className="h-16 w-16 text-yellow-500"
          strokeWidth={0.2}
        />
        <OutlineStarIcon
          className="h-16 w-16 text-yellow-500"
          strokeWidth={0.2}
        />
      </>
    );
  } else if (grade === GRADE.GREAT) {
    return (
      <>
        <StarIcon className="h-16 w-16 text-yellow-300" />
        <StarIcon className="h-16 w-16 text-yellow-300" />
        <OutlineStarIcon
          className="h-16 w-16 text-yellow-500"
          strokeWidth={0.2}
        />
      </>
    );
  } else if (grade === GRADE.EXCELENT) {
    return (
      <>
        <StarIcon className="h-16 w-16 text-yellow-300" />
        <StarIcon className="h-16 w-16 text-yellow-300" />
        <StarIcon className="h-16 w-16 text-yellow-300" />
      </>
    );
  }
};
export const Result: FC<{ gradeHistory: number[] }> = ({ gradeHistory }) => {
  const { setPage } = usePage();
  const grade = getMostfrequentGrade(gradeHistory);
  const [score, setScore] = useState<number>();
  const [highestScore, setHighestScore] = useState<number>();
  const [showLearderBoard, setShowLearderBoard] = useState(false);
  useEffect(() => {
    const _score = gradeHistory.reduce((partialSum, a) => partialSum + a, 0);
    setScore(_score);
    saveScoreIfHighest(_score);
    setHighestScore(getHighestScore());
  }, [gradeHistory]);

  return (
    <div className="prose prose-slate container mx-auto flex flex-col items-center">
      {showLearderBoard && <LeaderBoard setShowModal={setShowLearderBoard} />}
      <div className="text-2xl font-extrabold mt-10">
        VERY {GRADE[grade]} SCORE!
      </div>
      <div className="flex flex-row mt-4">{Stars(grade)}</div>
      <div className="text-8xl font-extrabold mt-4">{score}</div>
      <div className="text-xs mt-2">
        <div>EXCELENT: {gradeHistory.filter((x) => x === 3).length}</div>
        <div>GREAT: {gradeHistory.filter((x) => x === 2).length}</div>
        <div>GOOD: {gradeHistory.filter((x) => x === 1).length}</div>
        <div>BAD: {gradeHistory.filter((x) => x === 0).length}</div>
      </div>
      <div className="mt-2 text-sm">YOUR BEST SCORE: {highestScore}</div>

      <TweetButton
        className="mt-4 mb-4"
        text={`%0D%0AVery+Short%E3%81%AB%E3%81%AA%E3%81%A3%E3%81%A6%E3%81%97%E3%81%BE%E3%81%A3%E3%81%9FAnimal%E3%81%9F%E3%81%A1%E3%82%92%E5%8A%A9%E3%81%91%E3%81%9F%E3%82%88%EF%BC%81%0D%0AVERY+${GRADE[grade]}+SCORE%21%21%21%0D%0A%5BScore%3A+${score}%5D%0D%0A%23verycorrectlength%20%23%E3%83%99%E3%83%AA%E3%83%AD%E3%83%B3%E3%82%AF%E3%82%BD%E3%82%B2%E3%83%BC%E3%83%8F%E3%83%83%E3%82%AB%E3%82%BD%E3%83%B3%0D%0Averycorrectlength.com`}
      />
      <div className="mb-5 text-center">
        <button
          className={"btn btn-sm btn-accent"}
          onClick={() => {
            setShowLearderBoard(true);
          }}
        >
          Leader Board
          <ChartSquareBarIcon className="w-5 h-5" />
        </button>
      </div>
      <button
        className={"btn btn-wide mt-auto"}
        onClick={() => {
          setPage(PAGE.TOP);
        }}
      >
        GO TO TOP
      </button>
    </div>
  );
};
