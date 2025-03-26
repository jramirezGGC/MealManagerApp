// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import  ReactNativeAsyncStorage  from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW9vEj3fXQ6lLq58DJ5aEPEGBP6EcPqZA",
  authDomain: "mindful-meal-manager.firebaseapp.com",
  projectId: "mindful-meal-manager",
  storageBucket: "mindful-meal-manager.firebasestorage.app",
  messagingSenderId: "529853366251",
  appId: "1:529853366251:web:639fddf54764c08a45e3ae",
  measurementId: "G-GDDBPJ1WHL"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const analytics = getAnalytics(FIREBASE_APP);