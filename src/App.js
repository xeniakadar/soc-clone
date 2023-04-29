import React from 'react';
import { useEffect, useState } from "react";
import "./App.css";
import { db, auth, storage, user } from "./config/firebase";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Routes, Route } from 'react-router-dom';
import Auth from "./components/Auth";
import CreatePost from './components/CreatePost';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';

function App() {
  const [postList, setPostList] = useState([]);
  const [theme, setTheme] = useState("light");
  const postsCollectionRef = collection(db, "posts");

  const getPostList = async () => {
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({
          ...doc.data(),
          id: doc.id
        });
      })
      setPostList(posts);
    })
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
        <Route path='/log-in' element={<Auth />} />
      </Routes>

    </div>
  )
}

export default App;
