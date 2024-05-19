// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6zlJaY9qAbY1MPhJZlhC4pI3fvLwyZ2s",
  authDomain: "expensive-tracker-bb410.firebaseapp.com",
  projectId: "expensive-tracker-bb410",
  storageBucket: "expensive-tracker-bb410.appspot.com",
  messagingSenderId: "873320052263",
  appId: "1:873320052263:web:bae43f683e3b7e9d614002"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);