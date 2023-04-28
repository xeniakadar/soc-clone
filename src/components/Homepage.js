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
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useCollectionData } from 'react-firebase-hooks/firestore';

import uniqid from 'uniqid';
import { Link } from 'react-router-dom';
import AddNew from './AddComment';
import CommentsList from './CommentsList';

const Homepage = ({ getPostList, postList }) => {

  //update title state
  const [updatedTitle, setUpdatedTitle] = useState("");

  //CHANGE THIS SO IT DELETES COMMENTS AS WELL
  const deletePost = async (id, url) => {
    const postDoc = doc(db, "posts", id);
    //const commentDoc = doc(db, "comments", id);
    const postRef = ref(storage, url);
    deleteObject(postRef).then(() => {
      console.log("image deleted");
    }).catch((error) => {
      console.error(error)
    })
    await deleteDoc(postDoc);
    // await deleteDoc(commentDoc)
    getPostList();
  }

  const updatePostTitle = async (id) => {
    const postDoc = doc(db, "posts", id);
    await updateDoc(postDoc, { title: updatedTitle });
    getPostList();
  }

  return (
    <div>
      <Link to="/create-post">
        <button>Create Post</button>
      </Link>
        {postList.map((post) => (
          <div key={post.id}>
            <img className='post--image' key={post.postUrl} src={post.postUrl} alt={post.postUrl}/>
            <h1>{post.title}</h1>
            <h3>{post.userName}</h3>

            <CommentsList path={`posts/${post.id}/comments`}/>
            <AddNew path={`posts/${post.id}/comments`} />

            {auth?.currentUser?.uid === post.userId &&
            <div>
              <button onClick={() => deletePost(post.id, post.postUrl)}>delete post</button>
              <input placeholder="edit title" onChange={(e) => setUpdatedTitle(e.target.value)} />
              <button onClick={() => updatePostTitle(post.id)}>{" "}edit title</button>
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
