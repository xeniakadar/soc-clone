import React from 'react';
import '../App.css';
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
    <nav className='navbar--container navbar navbar-dark bg-primary'>

      <div className='navbar--functionality container-fluid '>
        <Link to="/">
          <img className='navbar--img' src={homeSvg} alt='home' height="24" class="d-inline-block align-text-top" />
        </Link>
        {auth.currentUser &&
        <Link to="/create-post">
          <img className='navbar--img' src={createPostSvg} alt='create post' height="24" class="d-inline-block align-text-top"/>
        </Link>
        }
      </div>
      {!auth.currentUser &&
        <Link to="/log-in">
          <button className="auth--sign-in" >Log In or Sign Up</button>
        </Link>
      }

      {auth.currentUser && <button className="auth--sign-out" onClick={logout}>Sign Out</button> }

    </nav>
  )
}
