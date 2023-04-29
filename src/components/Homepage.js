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
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useCollectionData,  } from 'react-firebase-hooks/firestore';

import { Link } from 'react-router-dom';
import AddComment from './AddComment';
import CommentsList from './CommentsList';
import AddLike from './AddLike';
import Navbar from './Navbar';
import binSvg from './images/bin.svg';
import pencilSvg from './images/pencil.svg'

const Homepage = ({ getPostList, postList }) => {

  //update title state
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [activeEdit, setActiveEdit] = useState(false);

  //CHANGE THIS SO IT DELETES COMMENTS AS WELL
  const deletePost = async (id, url) => {
    const commentDoc = doc(db, "comments", id);
    const postDoc = doc(db, "posts", id);
    const postRef = ref(storage, url);

    deleteObject(postRef).then(() => {
      console.log("image deleted");
    }).catch((error) => {
      console.error(error)
    })
    await deleteDoc(commentDoc)
    await deleteDoc(postDoc);
    getPostList();
  }

  const updatePostTitle = async (id) => {
    const postDoc = doc(db, "posts", id);
    await updateDoc(postDoc, { title: updatedTitle });
    getPostList();
  }

  function handleEdit() {
    setActiveEdit(!activeEdit)
  }

  return (
    <div className='home--container'>
       {auth.currentUser && <h1>Welcome, {auth?.currentUser?.displayName}!</h1>}
        {postList.map((post) => (
          <div key={post.id}>
            <h3 className='post--username'>{post.userName}</h3>

            <img className='post--image' key={post.postUrl} src={post.postUrl} alt={post.postUrl} />
            <div className='likes--container'>
              <AddLike path={`posts/${post.id}`}/>
              <h3  className='post--likes'>{post.likes.length} likes</h3>
            </div>
            <div className='post--caption'>
              <h3 className='post--username comment--pad ' >{post.userName}</h3>
              <h3 className='post--title comment--pad '>{post.title}</h3>
            </div>
            <CommentsList path={`posts/${post.id}/comments`}/>
            <AddComment path={`posts/${post.id}/comments`} />


            {auth?.currentUser?.uid === post.userId &&
            <div>
                <img onClick={() => deletePost(post.id, post.postUrl)} className='delete-btn' src={binSvg} alt='delete' />
                <img className='edit-btn' onClick={handleEdit} src={pencilSvg} alt='edit' />
                <div className='post--edit ' style={{display: activeEdit? "block" : "none"}}>
                  <input className='edit--title' placeholder="Edit title..." onChange={(e) => setUpdatedTitle(e.target.value)} />
                  <button className='edit--submit-btn' onClick={() => updatePostTitle(post.id)}>Submit new title</button>
                </div>
            </div>
            }
            <hr />

          </div>
        )
        )}
      </div>
  )
}

export default Homepage;
