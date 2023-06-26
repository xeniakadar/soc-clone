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
import {LazyLoadImage} from 'react-lazy-load-image-component';

import AddComment from './AddComment';
import CommentsList from './CommentsList';
import AddLike from './AddLike';
import binSvg from './images/bin.svg';
import pencilSvg from './images/pencil.svg'

const Homepage = ({ getPostList, postList }) => {

  //update title state
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [activeEdit, setActiveEdit] = useState(false);

  const deletePost = async (id, url) => {
    const commentDoc = doc(db, "comments", id);
    const postDoc = doc(db, "posts", id);
    const postRef = ref(storage, url);

    deleteObject(postRef).then(() => {
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
       {auth.currentUser && <h1 className='home--title text-3xl pl-5 bg-gray-light pt-5 z-0' >Welcome {auth?.currentUser?.displayName}!</h1>}
    <div className='home--container bg-gray-light p-3 grid grid-autofit z-50 relative gap-6 '>
        {postList.map((post) => (
          <div className="card bg-white p-3 shadow-md rounded-lg" key={post.id}>
            <div className='post--topnav flex justify-between'>
              <h3 className='post--username font-bold'>{post.userName}</h3>

              {auth?.currentUser?.uid === post.userId &&
              <div>
                  <img onClick={() => deletePost(post.id, post.postUrl)} className='delete-btn h-5 pointer-events-auto opacity-25 hover:opacity-100' src={binSvg} alt='delete' />
              </div>
              }
            </div>
            <LazyLoadImage
            className='post--image w-auto '
            key={post.postUrl}
            src={post.postUrl}
            alt={post.postUrl}

             />
            <div className='likesdate--container flex justify-between items-center '>
              <div className='likes--container flex items-center mt-1'>
                <AddLike className="pr-4"path={`posts/${post.id}`}/>
                {post.likes.length === 1 ? (<h3  className='post--likes pl-1'>{post.likes.length} like</h3>) : (<h3  className='post--likes pl-1'>{post.likes.length} likes</h3>)}
              </div>
              <h3 className='post--dateCreated'>{getDateObject(post)}</h3>
            </div>
            <div className='post--caption flex items-top'>
              <h3 className='post--username comment--pad font-bold pr-2 '  >{post.userName}</h3>

              {auth?.currentUser?.uid === post.userId?
              (<>
                {activeEdit? (
                <div className='post--edit pl-2 flex items-center' style={{display: activeEdit? "block" : "none"}}>
                  <input className='edit--title w-20 sm:w-35' placeholder="Edit title..." onChange={(e) => setUpdatedTitle(e.target.value)} />
                  <button className='edit--submit-btn pointer-events-auto mr-2 py-1 px-2 text-dark-green
                    rounded-full border-0 text-sm font-semibold  bg-light-green text-violet-700  hover:bg-dark-green
                    hover:text-light-green'
                    onClick={() => updatePostTitle(post.id)}>Submit</button>
                  <button className='cancel--submit-btn pointer-events-auto py-1 px-2 text-dark-green
                  rounded-full border-0 text-sm font-semibold  bg-light-green hover:bg-dark-green
                  hover:text-light-green' onClick={(() => setActiveEdit(false))}>x</button>
                </div>
                ) : (
                <h3 className='post--title comment--pad pr-1' onClick={() => updatePostTitle(post.id)}>{post.title}</h3>
                )}

                <img className='edit-btn h-4 opacity-25 hover:opacity-100' onClick={ handleEdit}  style={{display: activeEdit? "none" : "block"}} src={pencilSvg} alt='edit' />
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
