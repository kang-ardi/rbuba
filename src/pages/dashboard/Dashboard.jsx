import DashboardLayout from "../../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">

      <div className="container-fluid">

        <div className="row g-4">

          <div className="col-md-4">

            <div className="card shadow-sm">

              <div className="card-body">

                <h6>Siswa Aktif</h6>

                <h2>0</h2>

              </div>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow-sm">

              <div className="card-body">

                <h6>Siswa Menunggak</h6>

                <h2>0</h2>

              </div>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow-sm">

              <div className="card-body">

                <h6>Total Tunggakan</h6>

                <h2>Rp 0</h2>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}