import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
} from "firebase/functions";

import { db } from "../../firebase";
import { firebaseConfig } from "../../firebase/config";

const USERS_COLLECTION = "users";
const LOGIN_KEYS_COLLECTION = "loginKeys";

const normalizeLoginKey = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const normalizeUsername = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase();
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

const list = async () => {
  const usersRef = collection(db, USERS_COLLECTION);
  const usersQuery = query(usersRef, orderBy("name"));
  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((userDoc) => ({
    uid: userDoc.id,
    ...userDoc.data(),
  }));
};

const getProfile = async (uid) => {
  if (!uid) {
    return null;
  }

  const docRef = doc(db, USERS_COLLECTION, uid);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    uid: docSnap.id,
    ...docSnap.data(),
  };
};

const assertCreateInput = (data) => {
  if (!data?.name?.trim()) {
    throw new Error("Nama wajib diisi.");
  }

  if (!data?.username?.trim()) {
    throw new Error("Username wajib diisi.");
  }

  if (!data?.email?.trim()) {
    throw new Error("Email wajib diisi.");
  }

  if (!data?.password || data.password.length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  if (!data?.role) {
    throw new Error("Role wajib dipilih.");
  }
};

const createSecondaryAuth = () => {
  const secondaryApp = initializeApp(
    firebaseConfig,
    `user-create-${Date.now()}`
  );

  return {
    app: secondaryApp,
    auth: getAuth(secondaryApp),
  };
};

const create = async (data) => {
  assertCreateInput(data);

  const email = normalizeLoginKey(data.email);
  const username = normalizeUsername(data.username);
  const usernameKey = normalizeLoginKey(username);
  const loginKeys = [email, usernameKey];
  const secondary = createSecondaryAuth();
  let createdAuthUser = null;

  try {
    const credential =
      await createUserWithEmailAndPassword(
        secondary.auth,
        email,
        data.password
      );

    createdAuthUser = credential.user;

    await runTransaction(db, async (transaction) => {
      const userRef = doc(
        db,
        USERS_COLLECTION,
        createdAuthUser.uid
      );

      const emailKeyRef = doc(
        db,
        LOGIN_KEYS_COLLECTION,
        email
      );

      const usernameKeyRef = doc(
        db,
        LOGIN_KEYS_COLLECTION,
        usernameKey
      );

      const existingEmailKey =
        await transaction.get(emailKeyRef);

      const existingUsernameKey =
        await transaction.get(usernameKeyRef);

      if (existingEmailKey.exists()) {
        throw new Error("Email sudah digunakan.");
      }

      if (existingUsernameKey.exists()) {
        throw new Error("Username sudah digunakan.");
      }

      const now = serverTimestamp();

      const userData = {
        uid: createdAuthUser.uid,
        username,
        name: data.name.trim(),
        email,
        role: data.role,
        active: data.active === true,
        loginKeys,
        createdAt: now,
        updatedAt: now,
      };

      const loginKeyData = {
        uid: createdAuthUser.uid,
        email,
        active: data.active === true,
        createdAt: now,
        updatedAt: now,
      };

      transaction.set(userRef, userData);
      transaction.set(emailKeyRef, loginKeyData);
      transaction.set(usernameKeyRef, loginKeyData);
    });

    return createdAuthUser.uid;
  } catch (error) {
    if (createdAuthUser) {
      await deleteUser(createdAuthUser).catch(() => {});
    }

    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email sudah terdaftar di Firebase Auth.");
    }

    throw error;
  } finally {
    await deleteApp(secondary.app).catch(() => {});
  }
};

const updateUser = async (uid, data) => {
  if (!uid) {
    throw new Error("User tidak valid.");
  }

  const updates = {
    name: data.name.trim(),
    updatedAt: serverTimestamp(),
  };

  if (data.role) {
    updates.role = data.role;
  }

  await updateDoc(
    doc(db, USERS_COLLECTION, uid),
    updates
  );
};

const updatePassword = async (uid, password) => {
  if (!uid) {
    throw new Error("User tidak valid.");
  }

  if (!password || password.length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  const functions = getFunctions();
  const callable = httpsCallable(
    functions,
    "updateUserPassword"
  );

  await callable({
    uid,
    password,
  }).catch((error) => {
    if (
      error.code === "functions/not-found" ||
      error.code === "functions/unavailable" ||
      error.code === "functions/internal"
    ) {
      throw new Error(
        "Fitur ubah password membutuhkan Cloud Function updateUserPassword yang sudah dideploy."
      );
    }

    throw error;
  });
};

const updateStatus = async (userData, active) => {
  if (!userData?.uid) {
    throw new Error("User tidak valid.");
  }

  const batch = writeBatch(db);
  const now = serverTimestamp();

  batch.update(
    doc(db, USERS_COLLECTION, userData.uid),
    {
      active,
      updatedAt: now,
    }
  );

  (userData.loginKeys || []).forEach((key) => {
    batch.update(
      doc(db, LOGIN_KEYS_COLLECTION, key),
      {
        active,
        updatedAt: now,
      }
    );
  });

  await batch.commit();
};

const userService = {
  create,
  findByUsername,
  getProfile,
  list,
  update: updateUser,
  updatePassword,
  updateStatus,
};

export default userService;
