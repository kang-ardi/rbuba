import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function ProtectedRoute() {

  const {
    user,
    loading
  } = useAuth();

  const location = useLocation();

  // Menunggu pengecekan session Firebase
  if (loading) {

    return (

      <div
        className="d-flex justify-content-center align-items-center vh-100"
      >

        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>

      </div>

    );

  }

  // Belum login
  if (!user) {

    return (
      <Navigate
        to="/login"
        state={{
          from: location
        }}
        replace
      />
    );

  }

  // Sudah login
  return <Outlet />;

}