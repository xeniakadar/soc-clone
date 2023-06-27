import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { Fragment, useState } from "react";
import { useNavigate } from 'react-router';
import { Tab } from "@headlessui/react";

import googleSVG from './images/google.svg'

const Auth = () => {

  const [displayName, setDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [selected, setSelected] = useState(0)
  const navigate = useNavigate();

  const register = async (name, email, password) => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      ).catch((err) => console.log(err));

      await updateProfile(auth.currentUser, {displayName: name}).catch((err) => console.log(err))
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

   const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      navigate("/");
      window.location.reload();

    } catch (error) {
      console.log(error.message);

    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  // className={ ({ isActive }) =>
  //             `tab-button ${isActive ? 'active' : 'inactive'} rounded-lg p-2.5 text-sm font-medium leading-5 text-white ring-white ring-opacity-60 ring-offset-2 ring-offset-sage-dark-400 focus:outline-none focus:ring-2`}

  return (

    <div className="create bg-gray-light p-5 grid grid-autofit sm:flex sm:flex-col sm:px-32 md:px-52 lg:px-96   z-50 relative gap-6">

      <Tab.Group
      >
        <Tab.List className="flex space-x-1 rounded-xl bg-sage-dark p-1">

        <Tab as={Fragment} >
          {({selected}) => (
            <button
            className={`
              ${selected ? "bg-white text-sage-dark" : "text-white hover:bg-white/[0.12] hover:text-white"} w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-sage-dark-700',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-sage-dark-400 focus:outline-none focus:ring-2`
            }
            >
             Sign Up
            </button>
          )}
          </Tab>
          <Tab as={Fragment} >

            {({selected}) => (
              <button
              className={`
                ${selected ? "bg-white text-sage-dark" : "text-white hover:bg-white/[0.12] hover:text-white"} w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-sage-dark-700',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-sage-dark-400 focus:outline-none focus:ring-2`
              }
              >
                Log In
              </button>
            )}
            </Tab>
            {/* <Tab className={ ` rounded-lg p-2.5 text-sm font-medium leading-5 text-white ring-white ring-opacity-60 ring-offset-2 ring-offset-sage-dark-400 focus:outline-none focus:ring-2`} >
            Log In</Tab> */}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="login--elements flex flex-col">
              <input
                className="login--text-input rounded-md pl-2 p-1"
                placeholder="Add name..."
                onChange={(e) => {setDisplayName(e.target.value)}}
                type="text"
                id="register-name"
              />
              <label className="text-xs mb-3 opacity-50 p-1" for="register-name">Username</label>
              <input
                className="login--text-input rounded-md pl-2 p-1"
                placeholder="email..."
                onChange={(e) => {setRegisterEmail(e.target.value)}}
                type="email"
                id="register-email"
              />
              <label className="text-xs mb-3 opacity-50 p-1" for="register-email">Email</label>
              <input
                className="login--text-input rounded-md pl-2 p-1"
                placeholder="password..."
                type="password"
                onChange={(e) => {setRegisterPassword(e.target.value)}}
                id="register-pwd"
              />
              <label className="text-xs mb-3 opacity-50 p-1" for="register-pwd">Password</label>
              <button className="login--btn bg-sage-dark text-white w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-sage-dark-700',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-sage-dark focus:outline-none focus:ring-2" onClick={() => register(displayName, registerEmail,registerPassword)}>Sign Up</button>
              <h1 className="self-center p-5">or sign up using</h1>
                <img className="h-10 cursor-pointer" src={googleSVG} alt="sign in with google"  onClick={signInWithGoogle} />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="login--container flex flex-col">


                <input
                  className="login--text-input rounded-md pl-2 p-1"
                  placeholder="email..."
                  onChange={(e) => setLoginEmail(e.target.value)}
                  type="email"
                  id="login-email"
                />
                <label className="text-xs mb-3 opacity-50 p-1" for="login-email">Email</label>
                <input
                  className="login--text-input rounded-md pl-2 p-1 "
                  placeholder="password..."
                  type="password"
                  onChange={(e) => setLoginPassword(e.target.value)}
                  id="login-pwd"
                />
                <label className="text-xs mb-3 opacity-50 p-1" for="login-pwd">Password</label>
                <button className="login--btn bg-sage-dark text-white w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-sage-dark-700',
              ' ring-offset-sage-dark-400 focus:outline-none " onClick={login}>Log In</button>


                <h1 className="self-center p-5">or sign in using</h1>
                <img className="h-10 cursor-pointer" src={googleSVG} alt="sign in with google"  onClick={signInWithGoogle} />

            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
};

export default Auth;
