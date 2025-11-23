import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;