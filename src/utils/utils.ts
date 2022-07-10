import useImage from "use-image";
import crypto from "crypto-js";
import { saveScore } from "./firebase";

export const KonvaImage = (imagePath: string) => {
  const [image] = useImage(imagePath);
  return image;
};

const HIGHEST_SCORE_KEY = "bloamvexho";

const CRYPTO_KEY = "VeryLongAnimals";
const CRYPTO_KEY2 = "verycorrectlength";

const saveScoreFirestore = (score: number, encryptedStringScore: string) => {
  saveScore({
    pkYRAkEQw5: Math.random().toString(36).slice(2, 7),
    PQ8rn0Twca: encryptedStringScore,
    score: score,
  })
    .then((result) => {
      const data = result.data;
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
export const saveScoreIfHighest = (score: number) => {
  console.log(score);
  const highestScore = getHighestScore();

  if (score > highestScore) {
    console.log(score.toString());
    const encryptedScore = crypto.AES.encrypt(
      score.toString(),
      CRYPTO_KEY + CRYPTO_KEY2
    );
    localStorage.setItem(HIGHEST_SCORE_KEY, encryptedScore.toString());
    saveScoreFirestore(score, encryptedScore.toString());
  }
};

export const getHighestScore = () => {
  const encryptedData = localStorage.getItem(HIGHEST_SCORE_KEY);
  let highestScore = 0;
  console.log(encryptedData);
  if (encryptedData) {
    highestScore = Number(
      crypto.AES.decrypt(encryptedData, CRYPTO_KEY + CRYPTO_KEY2).toString(
        crypto.enc.Utf8
      )
    );
  }
  console.log(highestScore);
  return highestScore;
};
