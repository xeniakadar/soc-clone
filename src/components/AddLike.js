import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, query, where, getDocs  } from "firebase/firestore";
import React, { useState, useRef } from "react";
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

// import { doc, setDoc, updateDoc, arrayUnion, arrayRemove  } from "firebase/firestore";
// import React, { useState, useRef } from "react";
// import { db, auth } from "../config/firebase";
// import uniqid from 'uniqid'



// // path={`posts/${post.id}/likes`}
// export default function AddLike({ path }) {

//   async function handleNewLike(id) {

//     const docRef = doc(db, path, id);
//     await updateDoc(docRef, {
//       likes: arrayUnion(id)
//     })
//   }

//   return (
//     <div>
//       <button onClick={handleNewLike}>Like</button>
//     </div>
//   )
// }
