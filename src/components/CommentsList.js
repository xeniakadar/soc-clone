import { collection } from "firebase/firestore";
import React from "react";
import { db } from "../config/firebase";
import uniqid from 'uniqid';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export default function CommentsList({ path }) {

  const commentsCollectionRef = collection(db, path);
  const [docs] = useCollectionData(commentsCollectionRef);
  return (
    <div>
      {docs?.map((doc) => {
        return (
          <div className="comment--container" key={uniqid()}>
            <h5 className="post--username comment--pad">{doc.userName} </h5>
            <h5 className="post--title comment--pad">{doc.comment}</h5>
          </div>
        )
      }) }
    </div>
  )
}
