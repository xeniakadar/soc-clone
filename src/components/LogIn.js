import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";

export const Auth = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
   }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {!auth.currentUser &&
        <>
        <form>
          <input
            placeholder="email..."
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            placeholder="password..."
            type="password"
            onChange={((e) => setPassword(e.target.value))}
          />
          <button onClick={signIn}>Sing In</button>
        </form>
          <button className="auth--sign-in" onClick={signInWithGoogle}>Sign in With Google</button>
        </>
      }
    </div>
  )
};
