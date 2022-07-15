import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
} from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { PlayMode } from "./utils";

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
const db = getFirestore(firebaseApp);

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

export const saveScore = httpsCallable<
  {
    pkYRAkEQw5: string;
    PQ8rn0Twca: string;
    score: number;
    mode: PlayMode;
    name: string;
  },
  { score: number }
>(functions, "nmgIpjNOiD2");
export const getScores = httpsCallable<
  {},
  { easy: UserScore[]; hard: UserScore[] }
>(functions, "getScores");

export const updateUserName = httpsCallable<{ name: string }, { ok: boolean }>(
  functions,
  "updateUserName"
);
// saveScore({ pkYRAkEQw5: "", PQ8rn0Twca33: "" })
//   .then((result) => {
//     const data = result.data;
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

export type UserScore = {
  id: string;
  name: string;
  score: number;
};
// export const getScores = async () => {
//   const usersCollectionRef = collection(db, "users");
//   const querySnapshot = await getDocs(usersCollectionRef);
//   const userScores = querySnapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       score: data.score,
//       name: data.name,
//     };
//   });
//   return userScores as UserScore[];
// };

// export const updateName = (uid: string, newName: string) => {
//   const usersCollectionRef = doc(db, "users", uid);
//   return updateDoc(usersCollectionRef, {
//     name: newName,
//   });
//   // .catch((error) => {
//   //   // TODO:
//   //   console.log(error);
//   // });
// };

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
      // saveUID(user.uid);
      console.log("guest login success: ", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("guest login error: ", errorCode, errorMessage);
    });
};

export const getCurrentUser = () => {
  return getAuth().currentUser;
};

export const refetchCurrentUser = () => {
  return getAuth().currentUser?.reload() || Promise.reject();
};

// export const hoge = () => {
//   const user = getAuth().currentUser;
//   console.log(user);
//   updateProfile(user!, { displayName: "" }).catch((error) => {
//     console.log(error);
//   });
// };
