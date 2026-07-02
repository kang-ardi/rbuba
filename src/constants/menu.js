import {
  FaHome,
  FaMoneyBillWave,
  FaUserGraduate,
} from "react-icons/fa";

const menus = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
  },
  {
    title: "Data Siswa",
    path: "/students",
    icon: FaUserGraduate,
  },
  {
    title: "Pembayaran",
    path: "/payments",
    icon: FaMoneyBillWave,
  },
];

export default menus;