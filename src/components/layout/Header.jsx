import { FaBars, FaUserCircle } from "react-icons/fa";

export default function Header({ title }) {
  return (
    <header className="app-header shadow-sm">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">

          {/* Left */}
          <div className="d-flex align-items-center">

            <button
              className="btn btn-outline-secondary d-lg-none me-3"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
            >
              <FaBars />
            </button>

            <h4 className="mb-0 fw-semibold">
              {title}
            </h4>

          </div>

          {/* Right */}
          <div className="dropdown">

            <button
              className="btn btn-light border d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <FaUserCircle size={22} className="me-2" />

              <div className="text-start d-none d-md-block">
                My Profile                
              </div>

            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">

              <li>

                <button className="dropdown-item">

                  Profil Saya

                </button>

              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>

                <button className="dropdown-item text-danger">

                  Logout

                </button>

              </li>

            </ul>

          </div>

        </div>
      </div>
    </header>
  );
}