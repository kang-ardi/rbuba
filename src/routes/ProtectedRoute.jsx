import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import useAuth from "../hooks/useAuth";

import SystemError from "../pages/system/SystemError";

export default function ProtectedRoute({
  roles = [],
}) {
  const {
    user,
    profile,
    loading,
    systemReady,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <PageLoader message="Memverifikasi sesi..." />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (systemReady === null) {
    return (
      <PageLoader message="Memeriksa konfigurasi sistem..." />
    );
  }

  if (systemReady === "error") {
    return <SystemError />;
  }

  /*
    Database belum diinisialisasi.
    User yang sudah berhasil login via Firebase Auth
    harus boleh masuk ke Setup Wizard meskipun profile.role
    masih null, karena collection users belum terbentuk.
  */
  if (systemReady === false) {
    if (location.pathname !== "/system/setup") {
      return (
        <Navigate
          to="/system/setup"
          replace
        />
      );
    }

    return <Outlet />;
  }

  /*
    Database sudah ready.
    Setup Wizard tidak boleh dibuka ulang.
  */
  if (
    systemReady === true &&
    location.pathname === "/system/setup"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  if (
    profile &&
    profile.active === false
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    roles.length > 0 &&
    !roles.includes(profile?.role)
  ) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <Outlet />;
}