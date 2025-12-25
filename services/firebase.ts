import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDFLu7K9oaym08AhJmjXd5lnaYfPwoQh00",
  authDomain: "gen-lang-client-0766147983.firebaseapp.com",
  projectId: "gen-lang-client-0766147983",
  storageBucket: "gen-lang-client-0766147983.firebasestorage.app",
  messagingSenderId: "710812013074",
  appId: "1:710812013074:web:c07f34f1ec02713aba7ecb",
  measurementId: "G-LJKF8T22HQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;