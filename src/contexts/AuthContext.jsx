import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

import {
  authService,
  userService,
} from "../services";

const AuthContext = createContext(null);

const defaultProfile = {
  uid: null,
  name: "",
  email: "",
  role: null,
  active: false,
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(defaultProfile);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {

        try {

          if (!firebaseUser) {

            setUser(null);

            setProfile(defaultProfile);

            setLoading(false);

            return;

          }

          const profileData =
            await userService.getProfile(
              firebaseUser.uid
            );

          setUser(firebaseUser);

          if (profileData) {

            setProfile(profileData);

          } else {

            setProfile({
              ...defaultProfile,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });

          }

        } catch (error) {

          console.error(error);

          setUser(null);

          setProfile(defaultProfile);

        } finally {

          setLoading(false);

        }

      }
    );

    return () => unsubscribe();

  }, []);

  const value = {

    user,

    profile,

    role: profile?.role,

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