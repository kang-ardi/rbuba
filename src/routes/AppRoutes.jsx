import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import StudentList from "../pages/students/StudentList";
import PaymentList from "../pages/payments/PaymentList";
import Profile from "../pages/profile/Profile";
import TestFirebase from "../pages/TestFirebase";

export default function AppRoutes() {
  return (
    <BrowserRouter>

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
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route 
          path="/students" 
          element={
            <StudentList />
          } 
        />
        <Route 
          path="/payments" 
          element={
            <PaymentList />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Profile />
          } 
        />
        <Route
            path="/test"
            element={<TestFirebase />}
        />

      </Routes>

    </BrowserRouter>
  );
}