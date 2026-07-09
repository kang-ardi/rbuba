// src/constants/menu.js
/**
 * Tujuan     : Sumber tunggal definisi menu sidebar (path, label, icon, roles).
 * Caller     : Sidebar.
 * Dependensi : react-icons.
 * Main Funcs : MENU_ITEMS (named export).
 * Side Effect: Tidak ada.
 */
import {
  FiHome, FiUsers, FiCreditCard, FiUserCheck,
} from "react-icons/fi";

export const MENU_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: FiHome },
  { path: "/students",  label: "Siswa",     icon: FiUsers },
  { path: "/payments",  label: "Pembayaran", icon: FiCreditCard },
  {
    path: "/users",
    label: "User",
    icon: FiUserCheck,
    roles: ["superadmin", "admin"],
  }
];
