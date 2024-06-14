import { getFirestore, doc, addDoc, getDoc, getDocs, setDoc, deleteDoc, collection, query, limit, startAfter, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

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

Firestore.createData = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}

Firestore.update = async (collectionName, docId, newData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        data[key] = newData[key];
      }
    }
    await setDoc(docRef, data);
  } catch (error) {
    return firebaseErrorMessage[error.message];
  }
}

Firestore.delete = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    return firebaseErrorMessage[error.message] || error.message;
  }
}

Firestore.addObjectToList = async (collectionName, docId, mapField, arrayField, newObject) => {
  const docRef = doc(db, collectionName, docId);

  try {
    await docRef.update({
      [`${mapField}.${arrayField}`]: arrayUnion(newObject)
    })
  } catch (error) {
    return firebaseErrorMessage[error.message] || error.message;
  }
}

Firestore.removeObjectFromList = async (docPath, arrayField, objectToRemove) => {
  const docRef = doc(docPath);

  try {
    await updateDoc(docRef, {
      [arrayField]: arrayRemove(objectToRemove)
    });
  } catch (error) {
    return firebaseErrorMessage[error.message] || error.message;
  }
}