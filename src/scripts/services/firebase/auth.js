import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import { firebaseErrorMessage } from "./errors.js";
import { app } from './app.js';

const auth = getAuth(app)

export const FireAuth = {};

FireAuth.signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return auth.currentUser;
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}

FireAuth.signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    return result.user
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
};

FireAuth.signOut = async () => {
  try {
    await signOut(auth);
    return null;
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}