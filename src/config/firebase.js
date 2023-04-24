import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage, } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCGT9r4o0DQWVYT7o187LY3KLcypYb4bfE",
  authDomain: "socialclone-37e77.firebaseapp.com",
  projectId: "socialclone-37e77",
  storageBucket: "socialclone-37e77.appspot.com",
  messagingSenderId: "426883089601",
  appId: "1:426883089601:web:6253e8d5899bf36ae6c040"
};


const app = initializeApp(firebaseConfig);

//Authorization stuff
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
//username display
export const user = auth.currentUser;



//Cloud Firestore stuff
export const db = getFirestore(app);

//storage
export const storage = getStorage(app);
