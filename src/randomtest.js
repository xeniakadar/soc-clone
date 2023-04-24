import React from 'react';
import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL,  } from "firebase/storage";
import uniqid from 'uniqid';

function App() {
  const [movieList, setMovieList] = useState([]);

  //new movie states
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);
  const [newMovieUrl, setNewMovieUrl] = useState("");

  //update title state
  const [updatedTitle, setUpdatedTitle] = useState("");

  //file upload state
  const [imageUpload, setImageUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");
  //const imagesListRef = ref(storage, "projectFiles/")

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitMovie = async () => {
    // await uploadFile();
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
        url: uploadFile(), //changed line
      });
      getMovieList();
    } catch (error) {
      console.error(error)
    }
  }

  const uploadFile = async () => {
    if (imageUpload == null) return;
    const filesFolderRef = ref(storage, `projectFiles/${imageUpload.name + uniqid()}`) //you could add random names to the end(like uniqid)
    try {
      const snapshot = await uploadBytes(filesFolderRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      // setNewMovieUrl(url);
      return url; //added line
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <div>
      <h1>Social Clone</h1>
      {auth.currentUser && <h1>Hi {auth?.currentUser?.displayName}</h1>}
      <Auth />
      <div>
        <input
          placeholder="movie totle..."
          onChange={(e) => setNewMovieTitle(e.target.value)} />
        <input
          type="number"
          placeholder="release date"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))} />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Oscar?</label>
        <input type="file" onChange={(e) => setImageUpload(e.target.files[0])}/>
        <button onClick={onSubmitMovie}>Submit movie</button>
        <div>
        </div>
      </div>
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <img key={movie.url} src={movie.url} alt={movie.url}/>
            <h1>{movie.title}</h1>
            <h3>{movie.releaseDate}</h3>
            {movie.receivedAnOscar && <h3>Received an Oscar!!! </h3>}
            <button onClick={() => deleteMovie(movie.id)}>delete movie</button>
            <input placeholder="edit title" onChange={(e) => setUpdatedTitle(e.target.value)} />
            <button onClick={() => updateMovieTitle(movie.id)}>{" "}edit title</button>
            <hr />
          </div>
        )
        )}
      </div>
    </div>
  )
}

export default App;
