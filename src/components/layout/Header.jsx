import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";

export default function Header({ title }) {
  const navigate = useNavigate();

  const { logout, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Berhasil logout.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error("Gagal logout.");
    }
  };

  return (
    <header className="app-header shadow-sm">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">

          {/* Left */}
          <div className="d-flex align-items-center">

            <button
              type="button"
              className="btn btn-outline-secondary d-lg-none me-3"
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
              type="button"
              className="btn btn-light border d-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle
                size={22}
                className="me-2"
              />

              <div className="text-start d-none d-md-block">

                <div className="fw-semibold">
                  {profile?.name || "My Profile"}
                </div>

              </div>

            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">

              <li>

                <button
                  type="button"
                  className="dropdown-item"
                >
                  Profil Saya
                </button>

              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>

                <button
                  type="button"
                  className="dropdown-item text-danger d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
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