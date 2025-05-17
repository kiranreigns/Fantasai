import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign in with google
  const signinWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Sign up with email and password
  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Update the user profile with the name
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Sign out
  const signout = () => {
    return auth.signOut();
  };

  const value = {
    currentUser,
    loading,
    signin,
    signout,
    signup,
    resetPassword,
    signinWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
