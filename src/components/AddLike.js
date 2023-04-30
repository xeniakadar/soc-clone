import { doc, updateDoc, arrayUnion, arrayRemove  } from "firebase/firestore";
import React, { useState } from "react";
import { db, auth } from "../config/firebase";
import likedImage from './images/red-heart.png';
import dislikedImage from './images/empty-heart.png'

export default function AddLike({ path }) {

  const [like, setLike] = useState(false);

  async function handleNewLike() {
    const docRef = doc(db, path);
    await updateDoc(docRef, {
      likes: arrayUnion(auth?.currentUser?.uid)
    })
    setLike(true);
  }

  async function handleDislike() {

    const docRef = doc(db, path);
    await updateDoc(docRef, {
      likes: arrayRemove(auth?.currentUser?.uid)
    })
    setLike(false);
  }

  return (
    <div>
      <img
        onClick={() => like ? handleDislike() : handleNewLike()}
        className="like--btn" src={like ? likedImage : dislikedImage}
        alt={like ? "liked" : "disliked"} />
    </div>
  )
}
