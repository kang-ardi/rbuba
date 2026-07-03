import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";
import { authValidation } from "../../services";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const usernameRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {

    register,

    handleSubmit,

    setError,

    formState: { errors }

  } = useForm({

    defaultValues: {

      username: "",

      password: ""

    }

  });

  useEffect(() => {

    usernameRef.current?.focus();

  }, []);

  const onSubmit = async (data) => {

    const validation = authValidation.login(data);

    if (Object.keys(validation).length > 0) {

      Object.entries(validation).forEach(([field, message]) => {

        setError(field, {

          type: "manual",

          message

        });

      });

      return;

    }

    try {

      setLoading(true);

      await login(

        data.username,

        data.password

      );

      toast.success("Login berhasil.");

      navigate("/dashboard");

    }

    catch (error) {

      toast.error(error.message);

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      <div className="card auth-card">

        <div className="auth-header">
          <img
            src="/rbuba-horizontal.png"
            alt="RBUBA"
            className="auth-logo"
          />

          <h2 className="auth-title">
            SIGN IN
          </h2>
        </div>

        <div className="auth-body">

          <form
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className="mb-3">

              <label className="auth-label">

                Username

              </label>

              <input

                ref={usernameRef}

                type="text"

                className={`form-control auth-input ${
                  errors.username
                    ? "is-invalid"
                    : ""
                }`}

                placeholder="Email / NIS / Student Code / NIP"

                {...register("username")}

              />

              {errors.username && (

                <div className="auth-error">

                  {errors.username.message}

                </div>

              )}

            </div>

            <div className="mb-4">

              <label className="auth-label">

                Password

              </label>

              <div className="password-group">

                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  className={`form-control auth-input ${
                    errors.password
                      ? "is-invalid"
                      : ""
                  }`}

                  placeholder="Masukkan Password"

                  {...register("password")}

                />

                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                >

                  {showPassword
                    ? <FaEyeSlash />
                    : <FaEye />}

                </button>

              </div>

              {errors.password && (

                <div className="auth-error">

                  {errors.password.message}

                </div>

              )}

            </div>

            <button

              type="submit"

              className="btn btn-primary auth-btn w-100"

              disabled={loading}

            >

              {loading
                ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                    />
                    Signing In...
                  </>
                )
                : "Login"}

            </button>

          </form>

        </div>

        <div className="auth-footer">

          <div>

            Rumah Belajar Ubaidillah Bin Abdullah

          </div>

          <div className="auth-version">

            Version 1.0.0

          </div>

        </div>

      </div>

    </div>

  );

}