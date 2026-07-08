// src/pages/errors/NotFound.jsx
/**
 * Tujuan     : Halaman 404 — rute tidak ditemukan.
 * Caller     : AppRoutes (path "*").
 * Dependensi : ErrorPage.
 * Main Funcs : NotFound.
 * Side Effect: Tidak ada.
 */
import { FiSearch } from "react-icons/fi";
import ErrorPage from "./ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Halaman Tidak Ditemukan"
      message="Halaman yang Anda cari tidak ada atau telah dipindahkan."
      icon={FiSearch}
    />
  );
}