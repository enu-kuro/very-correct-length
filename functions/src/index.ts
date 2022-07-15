import { AES, enc } from "crypto-js";
import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
const hri = require("human-readable-ids").hri;

admin.initializeApp();
const db = admin.firestore();

enum PlayMode {
  EASY = "EasyMode",
  HARD = "HardMode",
}

const CRYPTO_KEY = "VeryLongAnimals";
const CRYPTO_KEY2 = "verycorrectlength";

// const CRYPTO_KEY_EASY = "easy";
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

  const easyModePromise = db.collection(PlayMode.EASY).doc(user.uid).set(
    {
      name: name,
    },
    { merge: true }
  );
  const hardModePromise = db.collection(PlayMode.HARD).doc(user.uid).set(
    {
      name: name,
    },
    { merge: true }
  );
  const updateUserPromise = admin.auth().updateUser(user.uid, {
    displayName: name,
  });
  const promises = [easyModePromise, hardModePromise, updateUserPromise];
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
      name: string;
    },
    context
  ) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "permission denied"
      );
    }

    let name = data.name;

    if (name === "") {
      name = "very-" + hri.random();
      await admin.auth().updateUser(context.auth.uid, {
        displayName: name,
      });
    }

    let cryptoKeyMode = "";
    let collectionName = "";
    if (data.mode === PlayMode.EASY) {
      // easymodeは以前と同じkeyにしておく
      // cryptoKeyMode = CRYPTO_KEY_EASY;
      collectionName = PlayMode.EASY;
    } else if (data.mode === PlayMode.HARD) {
      cryptoKeyMode = CRYPTO_KEY_HARD;
      collectionName = PlayMode.HARD;
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
        name: name,
      },
      { merge: true }
    );

    return { score: data.score };
  }
);

export const getScores = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "permission denied"
    );
  }
  const getScores = (mode: PlayMode) => {
    return db
      .collection(mode)
      .orderBy("score", "desc")
      .limit(30)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              score: data.score,
              name: data.name,
            };
          })
          .filter((data) => {
            return data.score !== undefined;
          });
      });
  };
  const result = await Promise.all([
    getScores(PlayMode.EASY),
    getScores(PlayMode.HARD),
  ]).then(([easyScores, hardScores]) => {
    return { easy: easyScores, hard: hardScores };
  });

  return result;
});

export const updateUserName = functions.https.onCall(
  async (data: { name: string }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "permission denied"
      );
    }
    const name = data.name;
    const uid = context.auth.uid;
    const easyModePromise = db.collection(PlayMode.EASY).doc(uid).set(
      {
        name: name,
      },
      { merge: true }
    );
    const hardModePromise = db.collection(PlayMode.HARD).doc(uid).set(
      {
        name: name,
      },
      { merge: true }
    );
    const updateUserPromise = admin.auth().updateUser(uid, {
      displayName: name,
    });
    const promises = [easyModePromise, hardModePromise, updateUserPromise];
    await Promise.all(promises).catch((error) => {
      console.error(error);
      throw new functions.https.HttpsError("internal", "internal");
    });

    return { ok: true };
  }
);

// export const migration = functions.https.onRequest(
//   async (request, response) => {
//     functions.logger.info("Hello logs!", { structuredData: true });

//     const users = await db
//       .collection("users")
//       .get()
//       .then((querySnapshot) => {
//         return querySnapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             score: data.score,
//             name: data.name,
//           };
//         });
//       });
//     users.forEach((user) => {
//       const name = user.name;
//       const uid = user.id;
//       const score = user.score;
//       const easyModePromise = db.collection(PlayMode.EASY).doc(uid).set(
//         {
//           score: score,
//           name: name,
//         },
//         { merge: true }
//       );
//       const hardModePromise = db.collection(PlayMode.HARD).doc(uid).set(
//         {
//           name: name,
//         },
//         { merge: true }
//       );
//       const updateUserPromise = admin.auth().updateUser(uid, {
//         displayName: name,
//       });
//       const promises = [easyModePromise, hardModePromise, updateUserPromise];
//       Promise.all(promises).catch((error) => {
//         console.error(error);
//         throw new functions.https.HttpsError("internal", "internal");
//       });
//     });
//     return;
//   }
// );
