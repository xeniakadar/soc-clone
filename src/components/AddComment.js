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
          <input className="comment--input rounded bg-gray-light pl-2" placeholder="Add a comment..." ref={name} />
          <div className="comment--btn-container ml-2">
           <button className="comment--submit-btn
          pointer-events-auto mr-2 py-1 px-2
          rounded-md border-0 text-sm font-semibold text-white bg-sage hover:opacity-90" type="submit">Post</button>

          </div>
        </form>
      }
    </div>
  );
}
