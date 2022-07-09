import useImage from "use-image";

export const KonvaImage = (imagePath: string) => {
  const [image] = useImage(imagePath);
  return image;
};

const HIGHEST_SCORE_KEY = "highest_score_key";
export const saveScoreIfHighest = (score: number) => {
  const highestScore = Number(localStorage.getItem(HIGHEST_SCORE_KEY));
  if (score > highestScore) {
    localStorage.setItem(HIGHEST_SCORE_KEY, score.toString());
  }
};

export const getHighestScore = () => {
  return Number(localStorage.getItem(HIGHEST_SCORE_KEY));
};
