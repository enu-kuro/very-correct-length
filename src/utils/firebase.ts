import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
// const db = getFirestore(firebaseApp);

const functions = getFunctions(firebaseApp);
// const addNumbers = httpsCallable(functions, "addNumbers");
// addNumbers({ firstNumber: 19, secondNumber: 33 })
//   .then((result) => {
//     const data = result.data;
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

export const saveScore = httpsCallable(functions, "nmgIpjNOiD");
// saveScore({ pkYRAkEQw5: "", PQ8rn0Twca33: "" })
//   .then((result) => {
//     const data = result.data;
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
export const loginGuest = async () => {
  const auth = getAuth();
  // setPersistence(browserLocalPersistence) to keep the user logged in at all times.
  await setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("guest keeping state");
      return signInAnonymously(auth);
    })
    .then((result) => {
      const user = result.user;
      console.log("guest login success: ", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("guest login error: ", errorCode, errorMessage);
    });
};
