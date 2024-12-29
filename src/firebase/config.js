import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBAOsKnUsvlDL8_eYh1D0gCbzpucr0lruM",
  authDomain: "sample-firebase-ai-app-ec5d4.firebaseapp.com",
  projectId: "sample-firebase-ai-app-ec5d4",
  storageBucket: "sample-firebase-ai-app-ec5d4.firebasestorage.app",
  messagingSenderId: "302625480532",
  appId: "1:302625480532:web:369d00098164f0676332c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services with explicit config
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app; 