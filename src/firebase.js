import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLMHif6cuDU8xgbvBNpBHMC218KFdjueo",
  authDomain: "ninong-grab.firebaseapp.com",
  databaseURL: "https://ninong-grab-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ninong-grab",
  storageBucket: "ninong-grab.appspot.com",
  messagingSenderId: "5412554287",
  appId: "1:5412554287:web:50f1642bafa175649fa8da",
  measurementId: "G-YR513ZHB3K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)

export default app;
