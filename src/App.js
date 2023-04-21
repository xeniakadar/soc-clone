// import React, {useRef, useState} from 'react';
// import './App.css';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import 'firebase/compat/auth';

// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';

// import SignIn from './components/SignIn';
// import SignOut from './components/SignOut';
// import ChatRoom from './components/Homepage';

// firebase.initializeApp({
//  apiKey: "AIzaSyCGT9r4o0DQWVYT7o187LY3KLcypYb4bfE",
//   authDomain: "socialclone-37e77.firebaseapp.com",
//   projectId: "socialclone-37e77",
//   storageBucket: "socialclone-37e77.appspot.com",
//   messagingSenderId: "426883089601",
//   appId: "1:426883089601:web:6253e8d5899bf36ae6c040"
// })

// const auth = firebase.auth();
// const firestore = firebase.firestore();

// function App() {

//   const [user] = useAuthState(auth);

//   return (
//     <div className='App'>
//       <header className='App-header'>
//         <h1>🔥</h1>
//         <SignOut />
//       </header>

//       <section>
//         {user? <ChatRoom /> : <SignIn />}
//       </section>
//     </div>
//   );
// }



// export default App;
import React, {useRef, useState} from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
 import { initializeApp } from 'firebase/app';
 import {
   getAuth,
   onAuthStateChanged,
   GoogleAuthProvider,
   signInWithPopup,
   signOut,
 } from 'firebase/auth';
 import {
   addDoc,
   query,
   orderBy,
   limit,
   onSnapshot,
   setDoc,
   updateDoc,
   doc,
   serverTimestamp,
 } from 'firebase/firestore';
 import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
 } from 'firebase/storage';

 import { getPerformance } from 'firebase/performance';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


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
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>🔥</h1>
        <SignOut />
      </header>

      <section>
        {user? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {

    auth.signInWithPopup(provider)
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>sign out</button>
  )
}

function ChatRoom() {

  const picturesRef = firestore.collection("pictures");

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [pictures, loading] = useCollectionData(picturesRef, {
    idField: "id",
  });

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';


  const handleUpload = async () => {
    if (!file) return;
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    const snapshot = await fileRef.put(file);
    const url = await snapshot.ref.getDownloadURL();
    firebase.firestore().collection("pictures").add({
      caption,
      url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setCaption('');
    setFile(null);
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Upload a picture</h2>
      <input
        type='text'
        value={caption}
        onChange={handleCaptionChange}
        placeholder='Caption'
      />
      <input
        type='file' accept='image/*' onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <hr />
      <h2>All Pictures</h2>
      {pictures.map((picture) => (
        <div key={picture.id}>
          <img src={picture.url} alt={picture.caption} />
          <p>{picture.caption}</p>
        </div>
      ))}
    </div>
  );

}


export default App;
