// src/pages/errors/Forbidden.jsx
/**
 * Tujuan     : Halaman 403 — akses ditolak (role tidak sesuai).
 * Caller     : AppRoutes (/403), ProtectedRoute (redirect).
 * Dependensi : ErrorPage.
 * Main Funcs : Forbidden.
 * Side Effect: Tidak ada.
 */
import { FiLock } from "react-icons/fi";
import ErrorPage from "./ErrorPage";

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="Akses Ditolak"
      message="Anda tidak memiliki izin untuk mengakses halaman ini."
      icon={FiLock}
    />
  );
}