import React from 'react';
import '../App.css';
import { Auth } from "./Auth";
import { auth} from "../config/firebase";
import homeSvg from './images/home.svg';
import createPostSvg from './images/add-post.svg';

import { Link } from 'react-router-dom';

export default function Navbar() {
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

      <Auth />

    </div>
  )
}
