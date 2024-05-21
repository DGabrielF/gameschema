import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import { firebaseErrorMessage } from "./errors.js";
import { app } from './app.js';
import { Firestore } from './firestore.js';

export const FireAuth = {
  auth: getAuth(app)
};

FireAuth.signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FireAuth.auth, email, password);
    await Firestore.createUserData(userCredential.user.uid, name);
    return userCredential.user;
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}

FireAuth.signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(FireAuth.auth, email, password);
    return userCredential.user;
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}

FireAuth.signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(FireAuth.auth, googleProvider);
    const user = result.user;
    const userExists = Firestore.checkUserExists(user.uid);
    if (!userExists) {
      await Firestore.createUserData(user.uid, "Anônimo")
    }
    return user
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
};

FireAuth.signOut = async () => {
  try {
    await signOut(FireAuth.auth);
    return null;
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}