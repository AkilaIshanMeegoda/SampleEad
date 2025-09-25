import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
export default function AdminUsers() {
  const { api } = useAuth();
  const [form, setForm] = useState({
    nic: "880112233V",
    email: "operator@example.com",
    password: "Password123!",
    role: "StationOperator",
    displayName: "Op1",
  });
  const [targetId, setTargetId] = useState("");
  const [msg, setMsg] = useState("");
  const create = async () => {
    try {
      const { data } = await api.post("/api/users", form);
      setMsg("Created user: " + data.id);
    } catch (e) {
      setMsg("Error: " + (e.response?.data?.error || "Failed"));
    }
  };
  const activate = async () => {
    try {
      await api.patch("/api/users/" + targetId + "/activate");
      setMsg("Activated");
    } catch (e) {
      setMsg("Error");
    }
  };
  const deactivate = async () => {
    try {
      await api.patch("/api/users/" + targetId + "/deactivate");
      setMsg("Deactivated");
    } catch (e) {
      setMsg("Error");
    }
  };
  return (
    <div>
      <h2>Admin Users</h2>
      <h3>Create Staff</h3>
      <div>
        <input
          placeholder="NIC"
          value={form.nic}
          onChange={(e) => setForm({ ...form, nic: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>Backoffice</option>
          <option>StationOperator</option>
        </select>
        <input
          placeholder="Display Name"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
        <button onClick={create}>Create</button>
      </div>
      <h3>Activate / Deactivate</h3>
      <div>
        <input
          placeholder="User Id"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
        <button onClick={activate}>Activate</button>
        <button onClick={deactivate}>Deactivate</button>
      </div>
      <p>{msg}</p>
    </div>
  );
}
