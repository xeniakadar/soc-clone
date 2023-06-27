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
    <div className='navbar--container pr-4 pl-4 flex h-16 items-center justify-between drop-shadow-4xl'>
      <div className='navbar--functionality flex'>
        <Link to="/">
          <img className='navbar--svg w-40 md:w-48' src={logoSvg} alt='home' />
        </Link>
        {auth.currentUser &&

        <Link to="/create-post">
          {/* <img className='navbar--img' src={createPostSvg} alt='create post' /> */}
          <button className='navbar--img ring-offset-2 w-24 ml-1 text-white hover:opacity-90 focus:outline-none focus:ring- bg-sage-dark rounded-lg py-1.5 text-md font-medium leading-5'>Add Post</button>
        </Link>

        }
      </div>

      {!auth.currentUser &&
        <Link to="/log-in">
          <button className="auth--sign-in ring-offset-2 w-auto px-3 py-2 ml-1 text-white hover:opacity-90 focus:outline-none focus:ring- bg-sage rounded-lg text-md font-medium leading-5" >Log In or Sign Up</button>
        </Link>
      }

      {auth.currentUser && <button className="auth--sign-out ring-offset-2 w-auto px-3 py-2 ml-1 text-white hover:opacity-90 focus:outline-none focus:ring- bg-sage rounded-lg text-md font-medium leading-5" onClick={logout}>Sign Out</button> }

    </div>
  )
}
