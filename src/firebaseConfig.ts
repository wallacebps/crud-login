// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpAgRptdF1zNf_GtcN9NAaoZwGaPM2Ai0",
  authDomain: "crud-login-6e977.firebaseapp.com",
  projectId: "crud-login-6e977",
  storageBucket: "crud-login-6e977.appspot.com",
  messagingSenderId: "75060550483",
  appId: "1:75060550483:web:ab9d2812595c2496a45fa6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };