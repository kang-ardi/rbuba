import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import StudentList from "../pages/students/StudentList";
import PaymentList from "../pages/payments/PaymentList";
import Profile from "../pages/profile/Profile";
import TestFirebase from "../pages/TestFirebase";
import TestAuth from "../pages/system/TestAuth";

export default function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

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

      <Route
        path="/test"
        element={<TestFirebase />}
      />

      <Route
        path="/test-auth"
        element={<TestAuth />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}