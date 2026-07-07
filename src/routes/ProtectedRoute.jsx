import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import useAuth from "../hooks/useAuth";

import SystemError from "../pages/system/SystemError";
import AccessDenied from "../pages/system/AccessDenied";

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

  /* ======================================
     AUTH LOADING
  ====================================== */

  if (loading) {

    return (
      <PageLoader
        message="Memverifikasi sesi..."
      />
    );

  }

  /* ======================================
     BELUM LOGIN
  ====================================== */

  if (!user) {

    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
        replace
      />
    );

  }

  /* ======================================
     SYSTEM CHECK
  ====================================== */

  if (systemReady === null) {

    return (
      <PageLoader
        message="Memeriksa konfigurasi sistem..."
      />
    );

  }

  /* ======================================
     SYSTEM ERROR
  ====================================== */

  if (systemReady === "error") {

    return <SystemError />;

  }

  /* ======================================
     DATABASE BELUM DISETUP
  ====================================== */

  if (!systemReady) {

    if (profile?.role === "superadmin") {

      if (location.pathname !== "/system/setup") {

        return (
          <Navigate
            to="/system/setup"
            replace
          />
        );

      }

    } else {

      return <AccessDenied />;

    }

  }

  /* ======================================
     DATABASE SUDAH READY
  ====================================== */

  if (
    systemReady &&
    location.pathname === "/system/setup"
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  /* ======================================
     USER ACTIVE
  ====================================== */

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

  /* ======================================
     ROLE AUTHORIZATION
  ====================================== */

  if (
    roles.length > 0 &&
    !roles.includes(profile?.role)
  ) {

    return (
      <Navigate
        to="/system/access-denied"
        replace
      />
    );

  }

  /* ======================================
     ACCESS GRANTED
  ====================================== */

  return <Outlet />;

}