import { getFirestore, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { app } from './app.js';
import { firebaseErrorMessage } from './errors.js';

const db = getFirestore(app);

export async function fetchDataFromFirebase(collectionName) {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const dataFromFirestore = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return dataFromFirestore;
  } catch (error) {
    console.error(firebaseErrorMessage[error.message]);
    return false;
  }
}