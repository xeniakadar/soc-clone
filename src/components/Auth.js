import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from 'react-router';

const Auth = () => {

  const [displayName, setDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword,
        displayName,
      );
      console.log(user);
      setRegisterEmail('');
      setRegisterPassword('');
      setDisplayName('');
    } catch (error) {
      console.log(error.message);
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

  //setName as well! displayName

  return (

    <div className="create">

      <div className="login--container">

        <div className="login--elements">
          <h1>Register</h1>

          <input
            className="login--text-input "
            placeholder="Add name..."
            onChange={(e) => {setDisplayName(e.target.value)}}
            type="text"
          />
          <input
            className="login--text-input "
            placeholder="email..."
            onChange={(e) => {setRegisterEmail(e.target.value)}}
            type="email"
          />
          <input
            className="login--text-input "
            placeholder="password..."
            type="password"
            onChange={(e) => {setRegisterPassword(e.target.value)}}
          />
          <button className="login--btn" onClick={register}>Sign Up</button>


        </div>
        <div className="login--elements">
          <h1>Log in with email</h1>
          <input
            className="login--text-input "
            placeholder="email..."
            onChange={(e) => setLoginEmail(e.target.value)}
            type="email"
          />
          <input
            className="login--text-input "
            placeholder="password..."
            type="password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button className="login--btn" onClick={login}>Log In</button>

        </div>

          <button className="login--google" onClick={signInWithGoogle}>Sign in With Google</button>
      </div>
    </div>
  )
};

export default Auth;
