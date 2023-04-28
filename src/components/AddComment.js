import { doc, setDoc } from "firebase/firestore";
import React, { useRef } from "react";
import { db, auth } from "../config/firebase";
import uniqid from 'uniqid'

export default function AddNew({path}) {
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
        <form onSubmit={handleSubmitComment}>
          <input ref={name} />
          <button type="submit">Add comment</button>
        </form>
      }
    </div>
  );
}
