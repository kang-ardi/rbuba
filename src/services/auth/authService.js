import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase";
import { userService } from "../index";

const normalizeLoginKey = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const isEmail = (value) => {
  return normalizeLoginKey(value).includes("@");
};

const login = async (username, password) => {
  try {
    const loginKey =
      normalizeLoginKey(username);

    if (!loginKey) {
      throw new Error("Username wajib diisi.");
    }

    let email = null;

    const loginUser =
      await userService.findByUsername(loginKey);

    if (loginUser) {
      if (!loginUser.active) {
        throw new Error("Akun telah dinonaktifkan.");
      }

      email = loginUser.email;
    } else {
      /*
        Fallback untuk kondisi Firestore kosong:
        login pertama menggunakan email Firebase Auth
        sebelum collection loginKeys terbentuk.
      */
      if (!isEmail(loginKey)) {
        throw new Error("Username tidak ditemukan.");
      }

      email = loginKey;
    }

    return await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        throw new Error("Username atau password salah.");

      case "auth/user-not-found":
        throw new Error("Akun tidak ditemukan.");

      case "auth/too-many-requests":
        throw new Error(
          "Terlalu banyak percobaan login. Silakan coba lagi nanti."
        );

      case "auth/network-request-failed":
        throw new Error(
          "Tidak dapat terhubung ke internet."
        );

      case "permission-denied":
        throw new Error(
          "Akses login ditolak. Periksa Firestore Rules dan collection loginKeys."
        );

      default:
        throw error;
    }
  }
};

const logout = async () => {
  await signOut(auth);
};

const authService = {
  login,
  logout,
};

export default authService;