// src/components/layout/Header.jsx
/**
 * Tujuan     : Header aplikasi — toggle sidebar, info user, logout.
 * Caller     : MainLayout.
 * Dependensi : useAuth (user + logout), react-icons.
 * Main Funcs : Header (default export). Props: onToggleSidebar.
 * Side Effect: Memanggil logout (Firebase Auth signOut via context/service).
 */
import { FiMenu, FiLogOut, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar navbar-expand bg-white border-bottom px-3">
      <button
        className="btn btn-outline-secondary btn-sm me-3"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu />
      </button>

      <span className="navbar-brand fw-semibold mb-0 text-secondary fs-6">Rumah Belajar Ubaidillah bin Abdullah</span>

      <div className="ms-auto d-flex align-items-center gap-2">
        <div className="dropdown">
          <button
            className="btn btn-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
          >
            <FiUser />
            <span className="d-none d-md-inline">
              {user?.displayName || user?.email}
            </span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link className="dropdown-item" to="/profile">Profil</Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={logout}>
                <FiLogOut className="me-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}