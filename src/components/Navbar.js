import React from 'react';
import '../App.css';
import { Auth } from "./Auth";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import homeSvg from './images/home.svg';
import createPostSvg from './images/add-post.svg';

import { Link } from 'react-router-dom';

export default function Navbar() {
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='navbar--container'>

      <div className='navbar--functionality'>
        <Link to="/">
          <img className='navbar--img' src={homeSvg} alt='home' />
        </Link>
        {auth.currentUser &&
        <Link to="/create-post">
          <img className='navbar--img' src={createPostSvg} alt='create post' />
        </Link>
        }
      </div>
      {!auth.currentUser &&
        <Link to="/log-in">
          <button className="auth--sign-in" >Log In or Sign Up</button>
        </Link>
      }

      {auth.currentUser && <button className="auth--sign-out" onClick={logout}>Sign Out</button> }

    </div>
  )
}
