import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    nic: "",
    email: "",
    password: "",
    displayName: "",
    phone: "",
  });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      nav("/stations");
    } catch {
      setErr("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-900 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          placeholder="NIC"
          value={form.nic}
          onChange={(e) => setForm({ ...form, nic: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          placeholder="Display Name"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
          Create Account
        </button>
      </form>
      {err && <p className="text-red-500 mt-2">{err}</p>}
    </div>
  );
}
