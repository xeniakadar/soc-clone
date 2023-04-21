import React, {useRef, useState} from 'react';
import '../App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import Post from './Post'

firebase.initializeApp({
 apiKey: "AIzaSyCGT9r4o0DQWVYT7o187LY3KLcypYb4bfE",
  authDomain: "socialclone-37e77.firebaseapp.com",
  projectId: "socialclone-37e77",
  storageBucket: "socialclone-37e77.appspot.com",
  messagingSenderId: "426883089601",
  appId: "1:426883089601:web:6253e8d5899bf36ae6c040"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

export default function Homepage() {

  // const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL, postURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      postURL,
    });

    setFormValue('');

    //dummy.current.scrollIntoView({ behavior: 'smooth'});
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <Post key={msg.id} message={msg} />)}

        {/* <div ref={dummy}></div> */}
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type='submit'>🕊️</button>
      </form>
    </>
  )
}
