// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCpaYYjIMIdxv01vm7FhJAUDy8BO8cN4BA",
  authDomain: "tracker-native-df1ec.firebaseapp.com",
  projectId: "tracker-native-df1ec",
  storageBucket: "tracker-native-df1ec.firebasestorage.app",
  messagingSenderId: "875885911271",
  appId: "1:875885911271:web:89c5c66d0544f93835d642"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
