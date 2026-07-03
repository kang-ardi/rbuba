import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase";
import { userService } from "../index";

const login = async (username, password) => {
  try {
    const user = await userService.findByUsername(username);

    if (!user) {
      throw new Error("Username tidak ditemukan.");
    }

    if (!user.active) {
      throw new Error("Akun telah dinonaktifkan.");
    }

    return await signInWithEmailAndPassword(
      auth,
      user.email,
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