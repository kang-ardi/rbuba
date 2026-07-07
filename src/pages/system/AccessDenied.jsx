import { Link } from "react-router-dom";

export default function AccessDenied() {

  return (

    <div className="container vh-100 d-flex justify-content-center align-items-center">

      <div
        className="card shadow"
        style={{
          maxWidth: 520,
          width: "100%",
        }}
      >

        <div className="card-body text-center p-5">

          <h1 className="display-5 fw-bold text-danger">

            403

          </h1>

          <h3 className="mb-3">

            Access Denied

          </h3>

          <p className="text-muted mb-4">

            Anda tidak memiliki hak akses untuk membuka halaman ini.

          </p>

          <Link
            to="/dashboard"
            className="btn btn-primary"
          >

            Kembali ke Dashboard

          </Link>

        </div>

      </div>

    </div>

  );

}