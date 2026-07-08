// src/components/layout/Footer.jsx
/**
 * Tujuan     : Footer aplikasi.
 * Caller     : MainLayout.
 * Dependensi : -
 * Main Funcs : Footer (default export).
 * Side Effect: Tidak ada.
 */
export default function Footer() {
  return (
    <footer className="bg-white border-top text-center text-muted small py-2">
      © {new Date().getFullYear()} RBUBA — All rights reserved.
    </footer>
  );
}