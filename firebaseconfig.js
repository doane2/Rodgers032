// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWbTUjdnMdYNYXmK86K6c5RMBFk-Tvkto",
  authDomain: "curt2-ea3dd.firebaseapp.com",
  projectId: "curt2-ea3dd",
  storageBucket: "curt2-ea3dd.appspot.com",
  messagingSenderId: "1000649865929",
  appId: "1:1000649865929:web:2c2513e106217f2a79ab18",
  measurementId: "G-PGKFR7LL6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the initialized services if needed
export { auth, db, storage };
