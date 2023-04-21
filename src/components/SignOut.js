import React from 'react';
import '../App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

firebase.initializeApp({
 apiKey: "AIzaSyCGT9r4o0DQWVYT7o187LY3KLcypYb4bfE",
  authDomain: "socialclone-37e77.firebaseapp.com",
  projectId: "socialclone-37e77",
  storageBucket: "socialclone-37e77.appspot.com",
  messagingSenderId: "426883089601",
  appId: "1:426883089601:web:6253e8d5899bf36ae6c040"
})

const auth = firebase.auth();

export default function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>sign out</button>
  )
}
