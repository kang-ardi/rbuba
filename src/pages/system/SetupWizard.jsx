import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import { setupService } from "../../services";

export default function SetupWizard() {
  const navigate = useNavigate();

  const {
    user,
    profile,
    refreshSession,
  } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const handleInitialize = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await setupService.initialize(
        user,
        profile
      );

      await refreshSession();

      toast.success(
        "Database berhasil diinisialisasi."
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error("SETUP INITIALIZE ERROR:", {
        code: error.code,
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      toast.error(
        error.message ||
        "Gagal menginisialisasi database."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="card shadow border-0"
        style={{
          width: "100%",
          maxWidth: "640px",
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img
              src="/rbuba-horizontal.png"
              alt="RBUBA"
              style={{
                width: "260px",
                maxWidth: "100%",
              }}
            />

            <h2 className="mt-4 mb-2">
              Setup Wizard
            </h2>

            <p className="text-muted mb-0">
              Selamat datang di RBUBA.
            </p>

            <p className="text-muted">
              Sistem perlu diinisialisasi sebelum dapat digunakan.
            </p>
          </div>

          <div className="alert alert-warning">
            <strong>
              Langkah ini hanya dilakukan satu kali.
            </strong>

            <hr />

            Setup Wizard akan membuat:

            <ul className="mb-0 mt-2">
              <li>System Settings</li>
              <li>Counter Generator</li>
              <li>Audit Log</li>
              <li>Default Superadmin User</li>
              <li>Login Keys</li>
            </ul>
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            disabled={loading}
            onClick={handleInitialize}
          >
            {
              loading
                ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Initializing Database...
                  </>
                )
                : "Initialize Database"
            }
          </button>

          <div className="text-center mt-4">
            <small className="text-muted">
              Rumah Belajar Ubaidillah Bin Abdullah
            </small>

            <br />

            <small className="text-muted">
              Version 1.0.0
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}