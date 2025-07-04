// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXkGMXK9DuKEutVS8piegeSy4VXwnYB-M",
  authDomain: "cafe-dashboard-337fa.firebaseapp.com",
  projectId: "cafe-dashboard-337fa",
  storageBucket: "cafe-dashboard-337fa.firebasestorage.app",
  messagingSenderId: "285955705042",
  appId: "1:285955705042:web:2470a77ac7751f72e4850b",
  measurementId: "G-FE2VRQZRRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);