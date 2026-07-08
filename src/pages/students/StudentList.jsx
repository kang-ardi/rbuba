import DashboardLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import PagePlaceholder from "../../components/common/PagePlaceholder";

export default function StudentList() {
  return (
    <DashboardLayout title="Data Siswa">

      <PageHeader
        title="Data Siswa"
        subtitle="Kelola seluruh data siswa."
      />

      <PagePlaceholder
        title="Modul Data Siswa"
        description="Fitur CRUD siswa akan dibuat pada Sprint 3."
      />

    </DashboardLayout>
  );
}