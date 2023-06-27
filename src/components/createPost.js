import React from 'react';
import '../App.css';
import { useState } from "react";
import { useNavigate } from 'react-router';
import { db, auth, storage } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL,  } from "firebase/storage";

import CreateAiCaption from './CreateAiCaption';
import uniqid from 'uniqid';
import loadingSvg  from './images/loading.svg'


const CreatePost = ({getPostList}) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState("");

  const postsCollectionRef = collection(db, "posts");
  const [activeUpload, setActiveUpload] = useState(false);

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
    <div className='flex justify-center'>
      <div className='create flex justify-start bg-ivory sm:w-2/5 rounded-lg '>
        {!auth.currentUser && <h1>To create a post, please sign in</h1>}
        {auth.currentUser &&
          <div className='create--container p-5 flex flex-col items-start'>
            <h1 className='pb-5 text-lg'>Add a photo and a caption to create a post </h1>
            <input
            className='create--file block w-full text-sm text-slate-500
            file:mr-5 file:py-1.5 file:px-4 file:text-white
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-sage file:text-violet-700
            hover:file:bg-sage-dark
            hover:file:opacity-80'
            type="file"
            onChange={handleUpload}
            accept="image/*"
            />
            <input
              className='create--text-input mt-5 pl-1 sm:w-48'
              placeholder="Add a caption..."
              onChange={(e) => setNewPostTitle(e.target.value)}
              id='caption'
            />
            <label className="text-xs mb-3 opacity-50 p-1" for="caption">Add Caption</label>
            <CreateAiCaption />

            <button className='create--submit-btn ring-offset-2 w-32 text-white hover:opacity-90 focus:outline-none focus:ring- bg-sage-dark rounded-lg py-2.5 text-md font-medium leading-5' onClick={handleSubmitPost}>Submit post</button>
            <div className='create--loading'>
            {activeUpload && <img className='create--loading pt-4' src={loadingSvg} alt='loading' />}
            </div>
          </div>
        }
      </div>
    </div>
  )

}

export default CreatePost
