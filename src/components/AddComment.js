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
  }

  return (
    <div>
      {auth.currentUser &&
        <form className="comment--container flex" onSubmit={handleSubmitComment}>
          <input className="comment--input rounded" placeholder="Add a comment..." ref={name} />
          <div className="comment--btn-container ml-2">
           <button className="comment--submit-btn
          mr-4 py-1.5 px-4 text-dark-green
          rounded-full border-0
          text-sm font-semibold
          bg-light-green text-violet-700
          hover:bg-dark-green
          hover:text-light-green" type="submit">Post</button>

          </div>
        </form>
      }
    </div>
  );
}
