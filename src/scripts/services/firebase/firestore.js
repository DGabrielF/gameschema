import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { app } from './app.js';
import { firebaseErrorMessage } from './errors.js';

const db = getFirestore(app);

export const Firestore = {};

Firestore.fetchDataFromFirebase = async(collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const dataFromFirestore = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return dataFromFirestore;
  } catch (error) {
    return firebaseErrorMessage[error.message];

  }
}

Firestore.checkUserExists = async (userId) => {
  const docRef = doc(db, "Users", userId);
  const docSnap = await getDoc(docRef)
  return docSnap.exists()
}

Firestore.createUserData = async (userId, userName) => {
  try {
    const docRef = doc(db, "Users", userId);
    await setDoc(docRef, {
      name: userName,
      coins: 1200,
      cards: {
        all: [],
        hand: [],
      },
      relationship: {
        friends: [],
        sentRequests: [],
        receivedRequests: [],
        blocked: []
      }
    });
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }

}