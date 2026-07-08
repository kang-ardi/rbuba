// src/constants/breadcrumb.js
/**
 * Tujuan     : Peta path -> label breadcrumb + daftar path yang punya halaman.
 * Caller     : Breadcrumb.
 * Dependensi : -
 * Main Funcs : BREADCRUMB_LABELS, LINKABLE_PATHS (named exports).
 * Side Effect: Tidak ada.
 */
export const BREADCRUMB_LABELS = {
  dashboard: "Dashboard",
  profile: "Profil",
  students: "Siswa",
  payments: "Pembayaran",
  system: "Sistem",
  setup: "Setup Wizard",
};

// Hanya path di daftar ini yang dirender sebagai link
export const LINKABLE_PATHS = [
  "/dashboard",
  "/profile",
  "/students",
  "/payments",
  "/system/setup",
];