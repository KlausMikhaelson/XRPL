import { initializeApp } from "firebase/app";
import { GithubAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU_4N5YlY_CzvFGBGjb6yAMqPEWD7QRB0",
  authDomain: "codeconnect-db43c.firebaseapp.com",
  projectId: "codeconnect-db43c",
  storageBucket: "codeconnect-db43c.appspot.com",
  messagingSenderId: "339629238396",
  appId: "1:339629238396:web:77cb07f4d45bcdd3d2c1f9",
  measurementId: "G-8YE2Z7F1CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();
const db = getFirestore(app); 
export { auth, provider, db };