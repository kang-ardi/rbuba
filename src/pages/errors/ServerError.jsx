// src/pages/errors/ServerError.jsx
/**
 * Tujuan     : Halaman 500 — kesalahan aplikasi (dipakai ErrorBoundary).
 * Caller     : ErrorBoundary, AppRoutes (/500).
 * Dependensi : ErrorPage.
 * Main Funcs : ServerError.
 * Side Effect: Tidak ada.
 */
import { FiAlertTriangle } from "react-icons/fi";
import ErrorPage from "./ErrorPage";

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      title="Terjadi Kesalahan"
      message="Terjadi kesalahan pada sistem. Silakan coba lagi nanti."
      icon={FiAlertTriangle}
    />
  );
}