import {
  Navigate,
  Outlet,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import PageLoader from "../components/common/PageLoader";

export default function GuestRoute() {

  const {
    user,
    loading,
  } = useAuth();

  // Menunggu Firebase mengecek session
  if (loading) {

    return (
      <PageLoader
        message="Memverifikasi sesi..."
      />
    );

  }

  // Sudah login
  if (user) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  // Belum login
  return <Outlet />;

}