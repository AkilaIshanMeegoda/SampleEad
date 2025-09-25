import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { api } = useAuth();
  const [form, setForm] = useState({ displayName: "", phone: "", email: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/api/users/me").then((r) =>
      setForm({
        displayName: r.data.displayName || "",
        phone: r.data.phone || "",
        email: r.data.email,
      })
    );
  }, []);

  const save = async () => {
    setMsg("");
    try {
      await api.patch("/api/users/me", {
        displayName: form.displayName,
        phone: form.phone,
      });
      setMsg("Saved");
    } catch {
      setMsg("Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <p className="mb-3">
        Email: <b>{form.email}</b>
      </p>
      <div className="space-y-3">
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
        <button
          onClick={save}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
      {msg && <p className="mt-3 text-green-500">{msg}</p>}
    </div>
  );
}
