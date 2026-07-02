export default function Login() {
  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <div className="card shadow-sm">

            <div className="card-body">

              <h3 className="text-center mb-2">

                Rumah Belajar

              </h3>
              <h4 className="text-center mb-2 pb-4 border-bottom">

                Ubadillah bin Abdullah

              </h4>

              <div className="mb-3">

                <label className="form-label">

                  Email

                </label>

                <input
                  type="email"
                  className="form-control"
                />

              </div>

              <div className="mb-4">

                <label className="form-label">

                  Password

                </label>

                <input
                  type="password"
                  className="form-control"
                />

              </div>

              <button
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}