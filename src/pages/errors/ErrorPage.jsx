// src/pages/errors/ErrorPage.jsx
/**
 * Tujuan     : Template dasar halaman error (dipakai 404/403/500).
 * Caller     : NotFound, Forbidden, ServerError.
 * Dependensi : react-router-dom.
 * Main Funcs : ErrorPage. Props: code, title, message, icon.
 * Side Effect: Tidak ada.
 */
import { Link } from "react-router-dom";

export default function ErrorPage({ code, title, message, icon: Icon }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center px-3">
      {Icon && <Icon size={64} className="text-secondary mb-3" />}
      <h1 className="display-1 fw-bold text-primary">{code}</h1>
      <h4>{title}</h4>
      <p className="text-muted">{message}</p>
      <Link to="/dashboard" className="btn btn-primary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}