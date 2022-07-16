import useImage from "use-image";
import crypto from "crypto-js";
import { getCurrentUser, refetchCurrentUser, saveScore } from "./firebase";
import { isIOS } from "react-device-detect";

export const KonvaImage = (imagePath: string) => {
  const [image] = useImage(imagePath);
  return image;
};

const HIGHEST_SCORE_KEY = "bloamvexho";

const EASY_HIGHEST_SCORE_KEY = "bloamvexhoe";
const HARD_HIGHEST_SCORE_KEY = "bloamvexhoh";

export enum PlayMode {
  EASY = "EasyMode",
  HARD = "HardMode",
}

const CRYPTO_KEY = "VeryLongAnimals";
const CRYPTO_KEY2 = "verycorrectlength";

// const CRYPTO_KEY_EASY = "easy";
const CRYPTO_KEY_HARD = "hard";

const saveScoreFirestore = async (
  score: number,
  encryptedStringScore: string,
  mode: PlayMode
) => {
  if (!getCurrentUser()?.displayName) {
    await refetchCurrentUser();
  }

  const reEncryptedScore = crypto.AES.encrypt(
    encryptedStringScore,
    getCurrentUser()!.uid
  );
  saveScore({
    pkYRAkEQw5: Math.random().toString(36).slice(2, 7),
    PQ8rn0Twca: reEncryptedScore.toString(),
    score: score,
    mode: mode,
    name: getCurrentUser()?.displayName || "",
  })
    .then((result) => {
      const data = result.data;
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

// export const saveScoreIfHighest = (score: number) => {
//   console.log(score);
//   const highestScore = getHighestScore();

//   if (score > highestScore) {
//     console.log(score.toString());
//     const encryptedScore = crypto.AES.encrypt(
//       score.toString(),
//       CRYPTO_KEY + CRYPTO_KEY2
//     );
//     localStorage.setItem(HIGHEST_SCORE_KEY, encryptedScore.toString());
//     saveScoreFirestore(score, encryptedScore.toString());
//   }
// };

const getCryptoKey = (mode: PlayMode) => {
  let cryptoKeyMode = "";
  if (mode === PlayMode.EASY) {
    // easymodeは以前と同じkeyにしておく
    // cryptoKeyMode = CRYPTO_KEY_EASY;
  } else if (mode === PlayMode.HARD) {
    cryptoKeyMode = CRYPTO_KEY_HARD;
  }
  return CRYPTO_KEY + CRYPTO_KEY2 + cryptoKeyMode;
};

const getStorageKey = (mode: PlayMode) => {
  let storageKey = EASY_HIGHEST_SCORE_KEY;
  if (mode === PlayMode.HARD) {
    storageKey = HARD_HIGHEST_SCORE_KEY;
  }
  return storageKey;
};
export const saveHighestScore = (score: number, mode: PlayMode) => {
  console.log(score);
  let highestScore = getHighestScore(mode);

  if (score > highestScore) {
    console.log(score.toString());
    const encryptedScore = crypto.AES.encrypt(
      score.toString(),
      getCryptoKey(mode)
    );
    localStorage.setItem(getStorageKey(mode), encryptedScore.toString());
    highestScore = score;
  }
  saveScoreFirestore(
    highestScore,
    localStorage.getItem(getStorageKey(mode))!.toString(),
    mode
  );
};

export const getHighestScore = (mode: PlayMode) => {
  const encryptedData = localStorage.getItem(getStorageKey(mode));
  let highestScore = 0;
  console.log(encryptedData);
  if (encryptedData) {
    highestScore = Number(
      crypto.AES.decrypt(encryptedData, getCryptoKey(mode)).toString(
        crypto.enc.Utf8
      )
    );
  }
  console.log(highestScore);
  return highestScore;
};

// const UID_KEY = "uid";
// export const saveUID = (uid: string) => {
//   localStorage.setItem(UID_KEY, uid);
// };

// export const getUID = () => {
//   return localStorage.getItem(UID_KEY);
// };

export let clickSound: HTMLAudioElement | null | undefined;
export let countDownSound: HTMLAudioElement | null | undefined;
export let countDownSound2: HTMLAudioElement | null | undefined;
export let extendSound: HTMLAudioElement | null | undefined;
export let resultSound: HTMLAudioElement | null | undefined;
export let bgmSound: HTMLAudioElement | null | undefined;
if (isIOS) {
} else {
  clickSound = new Audio("button55.mp3");
  clickSound.load();
  countDownSound = new Audio("button16.mp3");
  countDownSound.load();

  countDownSound2 = new Audio("button26.mp3");
  countDownSound2.load();

  extendSound = new Audio("button23.mp3");
  extendSound.load();

  resultSound = new Audio("orch-hit02.mp3");
  resultSound.load();

  bgmSound = new Audio("VeryLongAnimals_BGM.mp3");
  bgmSound.load();
  bgmSound.loop = true;

  clickSound.volume = 0;
  countDownSound.volume = 0;
  countDownSound2.volume = 0;
  extendSound.volume = 0;
  bgmSound.volume = 0;
  resultSound.volume = 0;
}

export const setSound = (isSound: boolean) => {
  if (isSound) {
    clickSound!.volume = 1;
    countDownSound!.volume = 1;
    countDownSound2!.volume = 1;
    extendSound!.volume = 1;
    bgmSound!.volume = 0.7;
    resultSound!.volume = 1;
  } else {
    clickSound!.volume = 0;
    countDownSound!.volume = 0;
    countDownSound2!.volume = 0;
    extendSound!.volume = 0;
    bgmSound!.volume = 0;
    resultSound!.volume = 0;
  }
};
