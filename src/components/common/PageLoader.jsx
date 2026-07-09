export default function PageLoader({
  message = "Memuat aplikasi..."
}) {
  return (
    <div
        className="spinner-border text-primary"
        role="status"
        style={{
            width: "3rem",
            height: "3rem",
        }}
        >
        <span className="visually-hidden">
            {message}
        </span>
    </div>
  );
}
