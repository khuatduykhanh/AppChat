// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {collection, initializeFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhs8SLnasJd5lDPGimjZmtGkkRf4VlQu0",
  authDomain: "appchat-58897.firebaseapp.com",
  projectId: "appchat-58897",
  storageBucket: "appchat-58897.appspot.com",
  messagingSenderId: "783567716561",
  appId: "1:783567716561:web:5640f7cebaae47833745f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
export const db = initializeFirestore(app, {experimentalForceLongPolling:true})