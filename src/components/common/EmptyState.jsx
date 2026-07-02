export default function EmptyState({
  title,
  description
}) {
  return (
    <div className="card shadow-sm border-0">

      <div className="card-body text-center py-5">

        <h5>{title}</h5>

        <p className="text-muted mb-0">
          {description}
        </p>

      </div>

    </div>
  );
}