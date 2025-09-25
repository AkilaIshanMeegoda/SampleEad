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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navbar */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold text-blue-400">
              ⚡ EV Charging
            </Link>
            {user && (
              <span className="px-2 py-1 rounded-full bg-gray-800 text-sm">
                {user.role}
              </span>
            )}
          </div>
          <nav className="flex gap-4 items-center">
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
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Routes */}
      <main className="max-w-6xl mx-auto p-6">
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
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
      <p>Sign in to manage bookings and stations.</p>
    </div>
  );
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
