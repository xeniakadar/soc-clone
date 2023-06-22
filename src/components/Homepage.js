import React from 'react';
import '../App.css';
import { useState } from "react";
import { db, auth, storage } from "../config/firebase";
import {
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import AddComment from './AddComment';
import CommentsList from './CommentsList';
import AddLike from './AddLike';
import binSvg from './images/bin.svg';
import pencilSvg from './images/pencil.svg'
import { getMonth } from 'date-fns';

const Homepage = ({ getPostList, postList }) => {

  //update title state
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [activeEdit, setActiveEdit] = useState(false);

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
    setActiveEdit(false)
  }

  function handleEdit() {
    setActiveEdit(!activeEdit);
  }

  function getDateObject(post) {
    const date = new Date(post.createdAt.seconds*1000);
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    const fullDate = `${month[(date.getMonth())]} ${date.getDate()} ${date.getFullYear()}`
    return fullDate
  }



  return (
    <>
       {auth.currentUser && <h1 className='home--title'>Welcome {auth?.currentUser?.displayName}!</h1>}
    <div className='home--container'>
        {postList.map((post) => (
          <div key={post.id}>
            <div className='post--topnav'>
              <h3 className='post--username'>{post.userName}</h3>

              {auth?.currentUser?.uid === post.userId &&
              <div>
                  <img onClick={() => deletePost(post.id, post.postUrl)} className='delete-btn' src={binSvg} alt='delete' />
              </div>
              }
            </div>
            <img className='post--image' key={post.postUrl} src={post.postUrl} alt={post.postUrl} />
            <div className='likesdate--container'>
              <div className='likes--container'>
                <AddLike path={`posts/${post.id}`}/>
                {post.likes.length === 1 ? (<h3  className='post--likes'>{post.likes.length} like</h3>) : (<h3  className='post--likes'>{post.likes.length} likes</h3>)}
              </div>
              <h3 className='post--dateCreated'>{getDateObject(post)}</h3>
            </div>
            <div className='post--caption'>
              <h3 className='post--username comment--pad ' >{post.userName}</h3>

              {auth?.currentUser?.uid === post.userId?
              (<>
                {activeEdit? (<div className='post--edit' style={{display: activeEdit? "block" : "none"}}>
                  <input className='edit--title' placeholder="Edit title..." onChange={(e) => setUpdatedTitle(e.target.value)} />
                  <button className='edit--submit-btn' onClick={() => updatePostTitle(post.id)}>Submit</button>
                  <button className='edit--submit-btn' onClick={(() => setActiveEdit(false))}>Cancel</button>
                </div>
                ) : (
                <h3 className='post--title comment--pad' onClick={() => updatePostTitle(post.id)}>{post.title}</h3>
                )}

                <img className='edit-btn' onClick={handleEdit} src={pencilSvg} alt='edit' />
              </>) : (
                <h3 className='post--title comment--pad'>{post.title}</h3>
              )}
            </div>
            <CommentsList path={`posts/${post.id}/comments`}/>
            <AddComment path={`posts/${post.id}/comments`} />
          </div>
        )
        )}
      </div>
    </>
  )
}

export default Homepage;
