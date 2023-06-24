import React from 'react';
import '../App.css';
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import logoSvg from './images/logo.svg'

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
          <img className='navbar--svg' src={logoSvg} alt='home' />
        </Link>
        {auth.currentUser &&
        <Link to="/create-post">
          {/* <img className='navbar--img' src={createPostSvg} alt='create post' /> */}
          <button className='navbar--img'>+</button>
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
