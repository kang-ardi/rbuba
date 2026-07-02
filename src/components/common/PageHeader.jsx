export default function PageHeader({
  title,
  subtitle
}) {
  return (
    <div className="mb-4">

      <h3 className="fw-bold mb-1">
        {title}
      </h3>

      <p className="text-muted mb-0">
        {subtitle}
      </p>

    </div>
  );
}