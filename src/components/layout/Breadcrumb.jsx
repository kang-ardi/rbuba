// src/components/layout/Breadcrumb.jsx
/**
 * Tujuan     : Breadcrumb otomatis dari URL aktif.
 * Caller     : MainLayout.
 * Dependensi : react-router-dom (useLocation, Link), constants/breadcrumb.
 * Main Funcs : Breadcrumb (default export).
 * Side Effect: Tidak ada.
 */
import { Link, useLocation } from "react-router-dom";
import { BREADCRUMB_LABELS, LINKABLE_PATHS } from "../../constants/breadcrumb";

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  // Di dashboard tidak perlu breadcrumb
  if (segments.length === 0 || pathname === "/dashboard") return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb text-secondary mb-0">
        <li className="breadcrumb-item">
          <Link to="/dashboard">
            Home
          </Link>
        </li>
      </ol>
    </nav>
  );

  const crumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_LABELS[seg] || seg,
    path: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb text-secondary mb-0">
        <li className="breadcrumb-item">
          <Link to="/dashboard">
            Home
          </Link>
        </li>
        {crumbs.map((c) => {
            const isLink = !c.isLast && LINKABLE_PATHS.includes(c.path);
            return (
                <li
                key={c.path}
                className={`breadcrumb-item ${c.isLast ? "active" : ""}`}
                aria-current={c.isLast ? "page" : undefined}
                >
                {isLink ? (
                    <Link to={c.path} className="text-decoration-none">{c.label}</Link>
                ) : (
                    <span className={c.isLast ? "" : "text-muted"}>{c.label}</span>
                )}
                </li>
            );
        })}
      </ol>
    </nav>
  );
}
