import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import authService from "../services/auth/authService";

const AuthContext = createContext(null);

const defaultProfile = {
  uid: null,
  name: "",
  email: "",
  role: null,
  studentCode: null,
  active: false,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(defaultProfile);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        setUser(firebaseUser);

        if (docSnap.exists()) {
          setProfile({
            uid: firebaseUser.uid,
            ...docSnap.data(),
          });
        } else {
          setProfile({
            ...defaultProfile,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    role: profile.role,
    loading,
    login: authService.login,
    logout: authService.logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;