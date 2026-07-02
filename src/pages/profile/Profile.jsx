import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import PagePlaceholder from "../../components/common/PagePlaceholder";

export default function Profile() {
  return (
    <DashboardLayout title="Profil Saya">

      <PageHeader
        title="Profil Saya"
        subtitle="Informasi akun pengguna."
      />

      <PagePlaceholder
        title="Profil"
        description="Fitur profil akan dikembangkan pada versi berikutnya."
      />

    </DashboardLayout>
  );
}