import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import StudentList from "../pages/students/StudentList";
import PaymentList from "../pages/payments/PaymentList";
import Profile from "../pages/profile/Profile";

import TestFirebase from "../pages/TestFirebase";
import TestAuth from "../pages/system/TestAuth";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* =========================
          Guest Route
      ========================== */}
      <Route element={<GuestRoute />}>

        <Route
          path="/login"
          element={<Login />}
        />

      </Route>

      {/* =========================
          Protected Route
      ========================== */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/students"
          element={<StudentList />}
        />

        <Route
          path="/payments"
          element={<PaymentList />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Development Only */}
        <Route
          path="/test"
          element={<TestFirebase />}
        />

        <Route
          path="/test-auth"
          element={<TestAuth />}
        />

      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}