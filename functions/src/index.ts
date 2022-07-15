import { collection } from "firebase/firestore";
import { AES, enc } from "crypto-js";
import * as functions from "firebase-functions";
const hri = require("human-readable-ids").hri;

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

enum PlayMode {
  EasyMode = "EasyMode",
  HardMode = "HardMode",
}

const CRYPTO_KEY = "VeryLongAnimals";
const CRYPTO_KEY2 = "verycorrectlength";

const CRYPTO_KEY_EASY = "easy";
const CRYPTO_KEY_HARD = "hard";

export const nmgIpjNOiD = functions.https.onCall(
  async (
    data: { pkYRAkEQw5: string; PQ8rn0Twca: string; score: number },
    context
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "permission denied"
      );
    }

    const bestScore = Number(
      AES.decrypt(data.PQ8rn0Twca, CRYPTO_KEY + CRYPTO_KEY2).toString(enc.Utf8)
    );

    if (bestScore !== data.score) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "invalid argument"
      );
    }
    await db.collection("users").doc(context.auth.uid).set(
      {
        score: bestScore,
      },
      { merge: true }
    );

    return { score: data.score };
  }
);

export const createUser = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const name = hri.random();
    await db
      .collection("users")
      .doc(context.params.userId)
      .set(
        {
          name: "very-" + name,
        },
        { merge: true }
      );
  });

///////////// New APIs
export const onCreateAuthUser = functions.auth.user().onCreate(async (user) => {
  const name = "very-" + hri.random();

  const easyModePromise = db.collection(PlayMode.EasyMode).doc(user.uid).set(
    {
      name: name,
    },
    { merge: true }
  );
  const hardModePromise = db.collection(PlayMode.HardMode).doc(user.uid).set(
    {
      name: name,
    },
    { merge: true }
  );
  const promises = [easyModePromise, hardModePromise];
  return Promise.all(promises).catch((error) => {
    console.error(error);
  });
});

// pkYRAkEQw5は使ってない
export const nmgIpjNOiD2 = functions.https.onCall(
  async (
    data: {
      pkYRAkEQw5: string;
      PQ8rn0Twca: string;
      score: number;
      mode: PlayMode;
    },
    context
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "permission denied"
      );
    }

    let cryptoKeyMode = "";
    let collectionName = "";
    if (data.mode === PlayMode.EasyMode) {
      cryptoKeyMode = CRYPTO_KEY_EASY;
      collectionName = PlayMode.EasyMode;
    } else if (data.mode === PlayMode.HardMode) {
      cryptoKeyMode = CRYPTO_KEY_HARD;
      collectionName = PlayMode.HardMode;
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "invalid argument"
      );
    }

    const decryptedScore = Number(
      AES.decrypt(
        data.PQ8rn0Twca,
        CRYPTO_KEY + CRYPTO_KEY2 + cryptoKeyMode
      ).toString(enc.Utf8)
    );

    if (decryptedScore !== data.score) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "invalid argument"
      );
    }
    await db.collection(collectionName).doc(context.auth.uid).set(
      {
        score: decryptedScore,
      },
      { merge: true }
    );

    return { score: data.score };
  }
);
