import { doc, setDoc } from "firebase/firestore";
import React, { useRef } from "react";
import { db, auth } from "../config/firebase";
import uniqid from 'uniqid'

export default function AddComment({path}) {
  const name = useRef();

  async function handleSubmitComment(e) {
    e.preventDefault();

    const docRef = doc(db, path, uniqid());
    await setDoc(docRef, {
      comment: name.current.value,
      userName: auth?.currentUser?.displayName
    });

    e.target.reset();
    console.log('comment added')
  }

  return (
    <div>
      {auth.currentUser &&
        <form className="comment--container" onSubmit={handleSubmitComment}>
          <input className="comment--input" placeholder="Add a comment..." ref={name} />
          <div className="comment--btn-container">
           <button className="comment--submit-btn" type="submit">Add comment</button>

          </div>
        </form>
      }
    </div>
  );
}
