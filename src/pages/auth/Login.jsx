import { useState } from "react";
import { FaSchool, FaSignInAlt } from "react-icons/fa";

import AuthLayout from "../../layouts/AuthLayout";

export default function Login() {

  const [loading] = useState(false);

  return (
    <AuthLayout>

      <div className="card shadow border-0 auth-card">

        <div className="card-body p-4 p-md-5">

          <div className="text-center mb-4">

            <div className="login-logo mb-3">

              <FaSchool />

            </div>

            <h3 className="fw-bold mb-1">

              Rumah Belajar

            </h3>

            <h4 className="fw-semibold">

              Ubaidillah Bin Abdullah

            </h4>

            <p className="text-muted mb-0">

              School Management System

            </p>

          </div>

          <div className="alert alert-danger d-none">

            Email atau password salah.

          </div>

          <form>

            <div className="mb-3">

              <label className="form-label">

                Email

              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Masukkan email"
              />

            </div>

            <div className="mb-4">

              <label className="form-label">

                Password

              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Masukkan password"
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  />

                  Masuk...
                </>
              ) : (
                <>
                  <FaSignInAlt className="me-2" />

                  Login
                </>
              )}

            </button>

          </form>

        </div>

        <div className="card-footer bg-white text-center small text-muted">

          © 2026 RBUBA

        </div>

      </div>

    </AuthLayout>
  );
}