import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, limit, startAfter } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

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

Firestore.fetchLimitedDataFromFirebase = async (collectionName, limitCount = 10, startAfterDoc = null) => {
  try {
    let collectionRef = collection(db, collectionName);
    let q;

    if (startAfterDoc) {
      q = query(collectionRef, limit(limitCount), startAfter(startAfterDoc));
    } else {
      q = query(collectionRef, limit(limitCount));
    }

    const snapshot = await getDocs(q);
    const dataFromFirestore = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return { data: dataFromFirestore, lastDoc: lastDoc };
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
};

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

Firestore.fetchDocById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = {
        uid: docSnapshot.id,
        ...docSnapshot.data(),
      };
      return data;
    } else {
      return "Usuário não encontrado.";
    }
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}