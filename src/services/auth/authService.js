import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase";

const login = async (email, password) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};

const logout = async () => {
  return await signOut(auth);
};

const authService = {
  login,
  logout,
};

export default authService;