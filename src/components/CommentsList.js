import { collection } from "firebase/firestore";
import React from "react";
import { db } from "../config/firebase";
import uniqid from 'uniqid';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function CommentsList({ path }) {

  const commentsCollectionRef = collection(db, path);
  const [docs, loading, error] = useCollectionData(commentsCollectionRef);
  return (
    <div>
      {docs?.map((doc) => {
        return (
          <div key={uniqid()}>
            <h5> {doc.userName} : </h5>
            <h5 >{doc.comment}</h5>
          </div>
        )
      }) }
    </div>
  )
}
