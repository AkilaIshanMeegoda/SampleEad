import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [emailOrNic, setId] = useState("");
  const [password, setPw] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(emailOrNic, password);
      nav("/stations");
    } catch {
      setErr("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-900 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          value={emailOrNic}
          onChange={(e) => setId(e.target.value)}
          placeholder="Email or NIC"
        />
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
      {err && <p className="text-red-500 mt-2">{err}</p>}
    </div>
  );
}
