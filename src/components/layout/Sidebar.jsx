import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaUserGraduate,
  FaMoneyBillWave,
  FaSchool
} from "react-icons/fa";

export default function Sidebar() {

  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />
    },
    {
      title: "Data Siswa",
      path: "/students",
      icon: <FaUserGraduate />
    },
    {
      title: "Pembayaran",
      path: "/payments",
      icon: <FaMoneyBillWave />
    }
  ];

  const sidebarContent = (
    <>

      <div className="sidebar-brand">

        <FaSchool size={36} />

        <h5 className="mt-3 mb-1">

          RBUBA

        </h5>

        <small>

          School Management System

        </small>

      </div>

      <hr />

      <ul className="nav flex-column">

        {menus.map((menu) => (

          <li
            key={menu.path}
            className="nav-item"
          >

            <Link
              to={menu.path}
              className={`nav-link ${
                location.pathname === menu.path
                  ? "active"
                  : ""
              }`}
            >

              <span className="me-2">

                {menu.icon}

              </span>

              {menu.title}

            </Link>

          </li>

        ))}

      </ul>

    </>
  );

  return (
    <>
      {/* Desktop */}

      <aside className="sidebar d-none d-lg-flex">

        {sidebarContent}

      </aside>

      {/* Mobile */}

      <div
        className="offcanvas offcanvas-start"
        id="sidebarMenu"
        tabIndex="-1"
      >

        <div className="offcanvas-body">

          {sidebarContent}

        </div>

      </div>

    </>
  );
}