import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function GuestRoute() {

  const {
    user,
    loading
  } = useAuth();

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

  // Jika sudah login, jangan boleh kembali ke halaman login
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