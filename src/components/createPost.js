import React from 'react';
import '../App.css';
import { useState } from "react";
import { Auth } from "./Auth";
import { db, auth, storage, user } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL,  } from "firebase/storage";
import uniqid from 'uniqid';
import { useNavigate } from 'react-router';


const CreatePost = ({getPostList}) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState("");

  const postsCollectionRef = collection(db, "posts");
  const [activeUpload, setActiveUpload] = useState(false);

  const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';
  const navigate = useNavigate();

  const handleSubmitPost = () => {
  if (imageUpload) {
    const filesFolderRef = ref(storage, `projectFiles/${imageUpload.name + uniqid()}`);
    const uploadTask = uploadBytesResumable(filesFolderRef, imageUpload);
    uploadTask
      .on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log('Upload is' + progress + '% done');
          setActiveUpload(true);
        },
        (error) => {
          console.error(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(url) => {
            setActiveUpload(false);
            const docRef =  await addDoc(postsCollectionRef, {
              title: newPostTitle,
              userId: auth?.currentUser?.uid,
              postUrl: url,
              userName: auth?.currentUser?.displayName,
              createdAt: serverTimestamp(),
              likes: [],
              // createdAt: db.firestore.FieldValue.serverTimestamp(), ADD TIMESTAMP
          });
          const postDoc = doc(db, "posts", docRef.id);
          await updateDoc(postDoc, { id: docRef.id });
          getPostList();
        });
      }
      )
  }
    setNewPostTitle("");
    setImageUpload(null);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
    }
  };

  return (
    <div className='create'>
      {!auth.currentUser && <h1>To create a post, please sign in</h1>}
      {auth.currentUser &&
        <div className='create--container'>
          <input
            className='create--text-input'
            placeholder="Add a caption..."
            onChange={(e) => setNewPostTitle(e.target.value)}
          />

          <input className='create--file' type="file" onChange={handleUpload}/>
          <button className='create--submit-btn' onClick={handleSubmitPost}>Submit post</button>
          <div>
          {activeUpload && <img src={LOADING_IMAGE_URL} alt='loading' />}
          </div>
        </div>
      }
    </div>
  )

}

export default CreatePost
