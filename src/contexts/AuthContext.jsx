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
  setupService,
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

  const [profile, setProfile] =
    useState(defaultProfile);

  const [loading, setLoading] =
    useState(true);

  /**
   * systemReady
   *
   * null    = sedang mengecek
   * true    = database sudah diinisialisasi
   * false   = database belum diinisialisasi
   * error   = gagal membaca Firestore
   */
  const [systemReady, setSystemReady] =
    useState(null);

  /**
   * Digunakan setelah Setup Wizard selesai.
   * Tidak mengekspos setSystemReady secara langsung.
   */
  const markSystemReady = () => {
    setSystemReady(true);
  };

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {

          setLoading(true);

          try {

            if (!firebaseUser) {

              setUser(null);

              setProfile(defaultProfile);

              setSystemReady(null);

              return;

            }

            setUser(firebaseUser);

            const profileData =
              await userService.getProfile(
                firebaseUser.uid
              );

            if (profileData) {

              setProfile(profileData);

            } else {

              setProfile({

                ...defaultProfile,

                uid: firebaseUser.uid,

                email: firebaseUser.email,

              });

            }

            try {

              const initialized =
                await setupService.isInitialized();

              setSystemReady(initialized);

            }

            catch (error) {

              console.error(error);

              setSystemReady("error");

            }

          }

          catch (error) {

            console.error(error);

            setUser(null);

            setProfile(defaultProfile);

            setSystemReady(null);

          }

          finally {

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

    systemReady,

    markSystemReady,

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