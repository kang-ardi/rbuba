import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

import PageLoader from "../components/common/PageLoader";

export default function ProtectedRoute({
  roles = [],
}) {

  const {
    user,
    profile,
    loading,
  } = useAuth();

  const location = useLocation();

  // Menunggu Firebase mengecek session
  if (loading) {

    return (
      <PageLoader
        message="Memverifikasi sesi..."
      />
    );

  }

  // Belum login
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

  // Akun tidak aktif
  if (!profile?.active) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // Tidak ada pembatasan role
  if (roles.length === 0) {

    return <Outlet />;

  }

  // Role tidak diizinkan
  if (!roles.includes(profile.role)) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  // Diizinkan
  return <Outlet />;

}