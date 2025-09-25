import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function AdminUsers() {
  const { api } = useAuth();
  const [form, setForm] = useState({
    nic: "",
    email: "",
    password: "",
    role: "StationOperator",
    displayName: "",
  });
  const [targetId, setTargetId] = useState("");
  const [msg, setMsg] = useState("");

  const create = async () => {
    try {
      const { data } = await api.post("/api/users", form);
      setMsg("Created user: " + data.id);
    } catch {
      setMsg("Error creating user");
    }
  };

  const activate = async () => {
    try {
      await api.patch("/api/users/" + targetId + "/activate");
      setMsg("Activated");
    } catch {
      setMsg("Error activating user");
    }
  };

  const deactivate = async () => {
    try {
      await api.patch("/api/users/" + targetId + "/deactivate");
      setMsg("Deactivated");
    } catch {
      setMsg("Error deactivating user");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-semibold">Admin: Users</h2>

      {/* Create Staff */}
      <div>
        <h3 className="text-lg font-medium mb-3">Create Staff</h3>
        <div className="flex flex-wrap gap-3">
          <input
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="NIC"
            value={form.nic}
            onChange={(e) => setForm({ ...form, nic: e.target.value })}
          />
          <input
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Backoffice</option>
            <option>StationOperator</option>
          </select>
          <input
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Display Name"
            value={form.displayName}
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
          />
          <button
            onClick={create}
            className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white"
          >
            Create
          </button>
        </div>
      </div>

      {/* Activate / Deactivate */}
      <div>
        <h3 className="text-lg font-medium mb-3">Activate / Deactivate</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="User Id"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <button
            onClick={activate}
            className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-white"
          >
            Activate
          </button>
          <button
            onClick={deactivate}
            className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded text-white"
          >
            Deactivate
          </button>
        </div>
      </div>

      {msg && <p className="text-blue-400">{msg}</p>}
    </div>
  );
}
