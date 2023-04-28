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
import CreatePost from './components/CreatePost';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';

function App() {
  const [postList, setPostList] = useState([]);

  const [theme, setTheme] = useState("light");

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
      <Navbar />
      <Routes>
        <Route path='/create-post' element={<CreatePost getPostList={getPostList} />} />
        <Route path='/' element={<Homepage getPostList={getPostList} postList={postList} />} />
      </Routes>

    </div>
  )
}

export default App;
