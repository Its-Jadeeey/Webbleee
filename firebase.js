import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAH5kpzZNEn-TfS4LGH7TK4RH19Y7tjJSI",
  authDomain: "webble-5b8fb.firebaseapp.com",
  projectId: "webble-5b8fb",
  storageBucket: "webble-5b8fb.firebasestorage.app",
  messagingSenderId: "415834876545",
  appId: "1:415834876545:web:52634eef32fdba285b7b80",
  measurementId: "G-LPE2B0EYXE"
};

const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
export const db = getFirestore(app);
 