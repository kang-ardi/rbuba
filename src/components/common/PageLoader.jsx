export default function PageLoader({
  title = "Rumah Belajar",
  subtitle = "Ubaidillah Bin Abdullah",
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
            Loading...
        </span>
    </div>
  );
}