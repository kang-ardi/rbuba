// src/components/common/EmptyState.jsx
/**
 * Tujuan     : Tampilan reusable saat data kosong / hasil pencarian nihil.
 * Caller     : Semua page list (students, payments, users, dll).
 * Dependensi : react-icons.
 * Main Funcs : EmptyState. Props: icon, title, message, actionLabel, onAction.
 * Side Effect: Tidak ada.
 */
import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  icon: Icon = FiInbox,
  title = "Tidak ada data",
  message = "Belum ada data untuk ditampilkan.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="text-center py-5">
      <Icon size={48} className="text-secondary mb-3" />
      <h5 className="text-secondary">{title}</h5>
      <p className="text-muted small mb-3">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}