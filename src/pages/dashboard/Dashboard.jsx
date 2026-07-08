import DashboardLayout from "../../layouts/MainLayout";

import DashboardCard from "../../components/common/DashboardCard";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";


import {
  FaUserGraduate,
  FaExclamationTriangle,
  FaMoneyBillWave
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">

      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang kembali, Administrator."
      />

      <div className="row g-4">

        <div className="col-12 col-md-6 col-xl-4">
          <DashboardCard
            title="Siswa Aktif"
            value="0"
            color="primary"
            icon={<FaUserGraduate />}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <DashboardCard
            title="Siswa Menunggak"
            value="0"
            color="warning"
            icon={<FaExclamationTriangle />}
          />
        </div>

        <div className="col-12 col-xl-4">
          <DashboardCard
            title="Total Tunggakan"
            value="Rp 0"
            color="danger"
            icon={<FaMoneyBillWave />}
          />
        </div>

      </div>

      <div className="mt-5">

        <PageHeader
          title="Pembayaran Terbaru"
          subtitle="Daftar transaksi pembayaran terbaru."
        />

        <EmptyState
          title="Belum ada transaksi"
          description="Transaksi pembayaran akan muncul di sini setelah data ditambahkan."
        />

      </div>

    </DashboardLayout>
  );
}