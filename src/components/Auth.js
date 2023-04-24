import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";


export const Auth = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  }
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in With Google</button>
      <button onClick={logout}>Sign Out</button>
    </div>
  )
};
