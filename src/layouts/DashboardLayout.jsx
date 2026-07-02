import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout({ title, children }) {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="app-main">

        <Header title={title} />

        <main className="app-content">

          {children}

        </main>

      </div>

    </div>
  );
}