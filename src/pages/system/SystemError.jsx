import { Link } from "react-router-dom";

export default function SystemError() {

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

          <h1 className="display-5 fw-bold text-warning">

            System Error

          </h1>

          <p className="text-muted mt-3 mb-4">

            Sistem tidak dapat terhubung ke database.

            <br />

            Periksa koneksi internet atau konfigurasi Firebase.

          </p>

          <Link
            to="/dashboard"
            className="btn btn-primary"
          >

            Coba Lagi

          </Link>

        </div>

      </div>

    </div>

  );

}