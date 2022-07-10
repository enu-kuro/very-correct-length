import { AES, enc } from "crypto-js";
import * as functions from "firebase-functions";

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const CRYPTO_KEY = "VeryLongAnimals";
const CRYPTO_KEY2 = "verycorrectlength";
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
    await db.collection("users").doc(context.auth.uid).set({
      score: bestScore,
    });

    return { score: data.score };
  }
);
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const addNumbers = functions.https.onCall((data) => {
  // [END addFunctionTrigger]
  // [START readAddData]
  // Numbers passed from the client.
  const firstNumber = data.firstNumber;
  const secondNumber = data.secondNumber;
  // [END readAddData]

  // [START addHttpsError]
  // Checking that attributes are present and are numbers.
  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with " +
        'two arguments "firstNumber" and "secondNumber" which must both be numbers.'
    );
  }
  // [END addHttpsError]

  // [START returnAddData]
  // returning result.
  return {
    firstNumber: firstNumber,
    secondNumber: secondNumber,
    operator: "+",
    operationResult: firstNumber + secondNumber,
  };
  // [END returnAddData]
});
