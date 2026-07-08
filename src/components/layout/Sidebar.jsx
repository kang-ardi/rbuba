// src/components/layout/Sidebar.jsx
/**
 * Tujuan     : Navigasi samping — role-based, collapse smooth + hover-expand
 *              (desktop), hidden total + overlay (mobile).
 * Caller     : MainLayout.
 * Dependensi : useAuth, constants/menu, NavLink.
 * Main Funcs : Sidebar. Props: collapsed, isMobile, mobileOpen.
 * Side Effect: Tidak ada.
 */
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { MENU_ITEMS } from "../../constants/menu";

const WIDTH_FULL = 240;
const WIDTH_MINI = 64;

export default function Sidebar({ collapsed, isMobile, mobileOpen }) {
  const { user } = useAuth();
  const role = user?.role;

  const [hovered, setHovered] = useState(false);
  // Setelah klik menu: tahan hover sampai mouse benar-benar keluar dari sidebar
  const suppressHover = useRef(false);

  // Hamburger ditekan -> reset semua state hover
  useEffect(() => {
    setHovered(false);
    suppressHover.current = false;
  }, [collapsed]);

  const items = MENU_ITEMS.filter((m) => !m.roles || m.roles.includes(role));

  if (isMobile && !mobileOpen) return null;

  const expanded = isMobile || !collapsed || hovered;

  const style = isMobile
    ? { width: WIDTH_FULL, zIndex: 1045 }
    : {
        width: expanded ? WIDTH_FULL : WIDTH_MINI,
        transition: "width .3s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        flexShrink: 0,
      };

  const handlePointerEnter = () => {
    if (!isMobile && collapsed && !suppressHover.current) {
      setHovered(true);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
    suppressHover.current = false; // hover aktif lagi setelah mouse keluar
  };

  const handleMenuClick = () => {
    suppressHover.current = true; // cegah expand ulang selama mouse masih di dalam
    setHovered(false);
  };

  return (
    <aside
      className={`sidebar text-white d-flex flex-column ${
        isMobile ? "position-fixed top-0 start-0 h-100" : ""
      }`}
      style={style}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="sidebar-logo p-3 border-bottom border-secondary text-center fw-bold">
        {expanded ? (
          <img
            src="/rbuba-horizontal.png"
            alt="RBUBA"
            style={{ height: "60px" }}
          />
        ) : (
          <img
            src="/logo.png"
            alt="R"
            style={{ height: "32px" }}
          />
        )}
      </div>

      <nav className="nav flex-column p-2 gap-1">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={handleMenuClick}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 fw-semibold rounded ${
                isActive ? "active" : ""
              }`
            }
            title={label}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            <span
              style={{
                opacity: expanded ? 1 : 0,
                transition: "opacity .2s ease .1s",
              }}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}