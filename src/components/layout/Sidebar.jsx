import { Link, useLocation } from "react-router-dom";
import { FaSchool } from "react-icons/fa";

import menus from "../../constants/menu";

export default function Sidebar() {
  const location = useLocation();

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="sidebar-brand text-center mb-4">
        <FaSchool size={40} />

        <small
          className="d-block mt-2"
          style={{ fontSize: "0.75rem", opacity: 0.75 }}
        >
          Rumah Belajar
          <br />
          Ubaidillah Bin Abdullah
        </small>
      </div>

      <hr className="border-secondary" />

      {/* Navigation */}
      <ul className="nav flex-column">

        {menus.map((menu) => {

          const Icon = menu.icon;

          const isActive = location.pathname === menu.path;

          return (
            <li
              className="nav-item mb-1"
              key={menu.path}
            >
              <Link
                to={menu.path}
                className={`nav-link d-flex align-items-center ${
                  isActive ? "active" : ""
                }`}
              >
                <Icon className="me-3" size={18} />

                <span>{menu.title}</span>
              </Link>
            </li>
          );
        })}

      </ul>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar d-none d-lg-flex flex-column">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarMenu"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title text-white">
            RBUBA
          </h5>

          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}