import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase";

const usersRef = collection(db, "users");

const findByUsername = async (username) => {
  const q = query(
    usersRef,
    where("loginKeys", "array-contains", username)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data();
};

const getProfile = async (uid) => {
  const docRef = doc(db, "users", uid);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data();
};

const userService = {
  findByUsername,
  getProfile,
};

export default userService;