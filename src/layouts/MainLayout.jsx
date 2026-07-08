// src/layouts/MainLayout.jsx
/**
 * Tujuan     : Layout utama (Header + Sidebar + Content + Footer), responsif.
 * Caller     : AppRoutes (rute protected).
 * Dependensi : Header, Sidebar, Footer, Outlet.
 * Main Funcs : MainLayout.
 * Side Effect: Listener resize window.
 */
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

import Breadcrumb from "../components/layout/Breadcrumb";

const MOBILE_BREAKPOINT = 992; // Bootstrap lg

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "1"
  );
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: buka/tutup
  const location = useLocation();

  // Deteksi resize
  useEffect(() => {
    const onResize = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Tutup sidebar mobile saat pindah halaman
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleToggle = () => {
    if (isMobile) setMobileOpen((o) => !o);
    else
      setCollapsed((c) => {
        localStorage.setItem("sidebar-collapsed", c ? "0" : "1");
        return !c;
      });
  };

  

  return (
    <div className="d-flex min-vh-100">
      <Sidebar
        collapsed={!isMobile && collapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Backdrop mobile */}
      {isMobile && mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="d-flex flex-column flex-grow-1 min-w-0">
        <Header onToggleSidebar={handleToggle} />
        <main className="flex-grow-1 p-3 bg-light">
          <Breadcrumb />
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}