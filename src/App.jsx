import React from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Stations from "./pages/Stations";
import Profile from "./pages/Profile";
import AdminStations from "./pages/admin/AdminStations";
import AdminUsers from "./pages/admin/AdminUsers";
import OperatorPanel from "./pages/operator/OperatorPanel";
import SchedulesEditor from "./pages/SchedulesEditor";
import { useAuth, AuthProvider } from "./auth/AuthContext";
function Shell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Link to="/">EV Charging</Link>
          {user && (
            <span style={{ marginLeft: 8, opacity: 0.7 }}>[{user.role}]</span>
          )}
        </div>
        <nav style={{ display: "flex", gap: 12 }}>
          {user && <Link to="/stations">Stations</Link>}
          {user?.role === "Backoffice" && (
            <>
              <Link to="/admin/stations">Admin Stations</Link>
              <Link to="/admin/users">Admin Users</Link>
            </>
          )}
          {user?.role === "StationOperator" && (
            <Link to="/operator">Operator</Link>
          )}
          {user && <Link to="/profile">Profile</Link>}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <a
              href="#"
              onClick={() => {
                logout();
                nav("/login");
              }}
            >
              Logout
            </a>
          )}
        </nav>
      </div>
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/stations"
            element={
              <RequireAuth>
                <Stations />
              </RequireAuth>
            }
          />
          <Route
            path="/schedules/:id"
            element={
              <RequireAuth>
                <SchedulesEditor />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/stations"
            element={
              <RequireRole role="Backoffice">
                <AdminStations />
              </RequireRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireRole role="Backoffice">
                <AdminUsers />
              </RequireRole>
            }
          />
          <Route
            path="/operator"
            element={
              <RequireRole role="StationOperator">
                <OperatorPanel />
              </RequireRole>
            }
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </>
  );
}
function Home() {
  return <div>Welcome</div>;
}
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}
export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
