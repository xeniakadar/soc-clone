import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db, auth } from "../config/firebase";
import uniqid from 'uniqid'

export default function AddLike({ path }) {

  const [like, setLike] = useState(false);

  async function handleNewLike(e) {
    e.preventDefault();

    const docRef = doc(db, path, uniqid);
    await setDoc(docRef, {
      id: auth?.currentUser?.id
    });
  }

  async function handleNewDislike(e) {
    e.preventDefault();
  }

  return (
    <div>
      <button onClick={handleNewLike}>Like</button>
    </div>
  )
}
