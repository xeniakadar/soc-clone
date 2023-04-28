import React from 'react';
import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/Auth";
import { db, auth, storage, user } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject  } from "firebase/storage";
import { Routes, Route } from 'react-router-dom';
import CreatePost from './components/createPost';
import Homepage from './components/Homepage';

function App() {
  const [postList, setPostList] = useState([]);

  const postsCollectionRef = collection(db, "posts");


  const getPostList = async () => {
    try {
      const data = await getDocs(postsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPostList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);

  return (
    <div>
      <h1>Social Clone</h1>
      {auth.currentUser && <h1>Hi {auth?.currentUser?.displayName}</h1>}
        <Auth />
      <Routes>
        <Route path='/create-post' element={<CreatePost getPostList={getPostList} />} />
        <Route path='/' element={<Homepage getPostList={getPostList} postList={postList} />} />
      </Routes>

    </div>
  )
}

export default App;

  // const onSubmitMovie = async () => {
  //   // await uploadFile();
  //   try {
  //     await uploadFile();
  //     await addDoc(postsCollectionRef, {
  //       title: newMovieTitle,
  //       receivedAnOscar: isNewMovieOscar,
  //       userId: auth?.currentUser?.uid,
  //       movieUrl: newMovieUrl,
  //     });
  //     getMovieList();
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const uploadFile = async () => {
  //   const filesFolderRef = ref(storage, `projectFiles/${imageUpload.name + uniqid()}`);
  //   await uploadBytesResumable(filesFolderRef, imageUpload).then((snapshot) => {
  //     getDownloadURL(snapshot.ref).then((url) => {
  //       console.log(url)
  //       setNewMovieUrl(url);
  //       console.log("newmovieURL: " , newMovieUrl)
  //     });
  //   });
  // }
