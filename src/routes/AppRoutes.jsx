import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

/* ===========================
   AUTH
=========================== */

import Login from "../pages/auth/Login";

/* ===========================
   DASHBOARD
=========================== */

import Dashboard from "../pages/dashboard/Dashboard";

/* ===========================
   PROFILE
=========================== */

import Profile from "../pages/profile/Profile";

/* ===========================
   STUDENTS
=========================== */

import StudentList from "../pages/students/StudentList";

/* ===========================
   PAYMENTS
=========================== */

import PaymentList from "../pages/payments/PaymentList";

/* ===========================
   SYSTEM
=========================== */

import SetupWizard from "../pages/system/SetupWizard";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/errors/NotFound";
import Forbidden from "../pages/errors/Forbidden";


export default function AppRoutes() {

  return (

    <Routes>

      {/* ======================================
          DEFAULT
      ====================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* ======================================
          GUEST
      ====================================== */}

      <Route
        element={<GuestRoute />}
      >

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Tambah rute publik (di luar guard) */}
        <Route path="/403" element={<Forbidden />} />

      </Route>

      {/* ======================================
          PROTECTED
      ====================================== */}

      <Route element={<ProtectedRoute />}>

          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* Students */}

          <Route
            path="/students"
            element={<StudentList />}
          />

          {/* Payments */}

          <Route
            path="/payments"
            element={<PaymentList />}
          />

          {/* Setup Wizard */}

          <Route
            path="/system/setup"
            element={<SetupWizard />}
          />

          {/* ======================================
              SUPERADMIN
          ====================================== */}

          <Route
            element={
              <ProtectedRoute
                roles={["superadmin"]}
              />
            }
          >

            {/*
            <Route
              path="/users"
              element={<UserList />}
            />
            */}

          </Route>

          {/* ======================================
              SUPERADMIN + ADMIN
          ====================================== */}

          <Route
            element={
              <ProtectedRoute
                roles={[
                  "superadmin",
                  "admin",
                ]}
              />
            }
          >

            {/*
            <Route
              path="/commitments"
              element={<CommitmentList />}
            />
            */}

          </Route>
      </Route>

      {/* ======================================
          404
      ====================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );

}