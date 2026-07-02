export default function PagePlaceholder({
  title,
  description,
}) {
  return (
    <div className="card border-0 shadow-sm">

      <div className="card-body text-center py-5">

        <h3 className="fw-bold">

          {title}

        </h3>

        <p className="text-muted mb-0">

          {description}

        </p>

      </div>

    </div>
  );
}