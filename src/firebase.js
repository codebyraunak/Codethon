import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyArnUXYEcB_h55eEx33PKaQW0b0QfFsP9Y",
  authDomain: "codethon-34ed5.firebaseapp.com",
  databaseURL: "https://codethon-34ed5-default-rtdb.firebaseio.com",
  projectId: "codethon-34ed5",
  storageBucket: "codethon-34ed5.firebasestorage.app",
  messagingSenderId: "435171073837",
  appId: "1:435171073837:web:b9abd366044105e2837da4",
  measurementId: "G-69KQLYWMEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
