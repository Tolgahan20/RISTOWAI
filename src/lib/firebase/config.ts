import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbON-YH-7EI3sn0CS5Gk2KBTQmrCDqE1U",
  authDomain: "ristowai.firebaseapp.com",
  projectId: "ristowai",
  storageBucket: "ristowai.firebasestorage.app",
  messagingSenderId: "860078258502",
  appId: "1:860078258502:web:416d06dbc83a6cc9f38d47",
  measurementId: "G-LMHMMK2LQC"
};

// Initialize Firebase only once
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth };

