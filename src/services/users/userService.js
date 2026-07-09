import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

const normalizeLoginKey = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const findByUsername = async (username) => {
  const loginKey = normalizeLoginKey(username);

  if (!loginKey) {
    return null;
  }

  const docRef = doc(db, "loginKeys", loginKey);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
};

const getProfile = async (uid) => {
  if (!uid) {
    return null;
  }

  const docRef = doc(db, "users", uid);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    uid: docSnap.id,
    ...docSnap.data(),
  };
};

const userService = {
  findByUsername,
  getProfile,
};

export default userService;