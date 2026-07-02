import { FaArrowRight } from "react-icons/fa";

export default function DashboardCard({
  title,
  value,
  icon,
  color = "primary"
}) {
  return (
    <div className={`card border-0 shadow-sm border-start border-4 border-${color}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">

          <div>

            <div className="text-muted small mb-2">
              {title}
            </div>

            <h2 className="mb-0 fw-bold">
              {value}
            </h2>

          </div>

          <div
            className={`text-${color}`}
            style={{ fontSize: "2rem" }}
          >
            {icon}
          </div>

        </div>

        <hr />

        <small className="text-muted">
          Detail akan tersedia setelah data ditambahkan
          <FaArrowRight className="ms-2" />
        </small>

      </div>
    </div>
  );
}