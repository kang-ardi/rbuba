import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import PagePlaceholder from "../../components/common/PagePlaceholder";

export default function PaymentList() {
  return (
    <DashboardLayout title="Pembayaran">

      <PageHeader
        title="Pembayaran"
        subtitle="Kelola transaksi pembayaran siswa."
      />

      <PagePlaceholder
        title="Modul Pembayaran"
        description="Fitur pembayaran akan dibuat pada Sprint 5."
      />

    </DashboardLayout>
  );
}