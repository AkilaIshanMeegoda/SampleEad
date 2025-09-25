import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";

export default function AdminStations() {
  const { api } = useAuth();
  const [form, setForm] = useState({
    name: "Downtown Station",
    lat: 6.9271,
    lng: 79.8612,
    type: "AC",
    totalSlots: 4,
  });
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/api/stations");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/api/stations", form);
    await load();
  };

  const toggleActive = async (st) => {
    if (st.active) {
      await api.patch("/api/stations/" + st.id + "/deactivate");
    } else {
      await api.put("/api/stations/" + st.id, { ...st, active: true });
    }
    await load();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Admin: Stations</h2>
      <div className="flex flex-wrap gap-3 bg-gray-900 p-4 rounded-lg mb-6">
        <input
          className="p-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="p-2 bg-gray-800 border border-gray-700 rounded w-28"
          placeholder="Lat"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) })}
        />
        <input
          className="p-2 bg-gray-800 border border-gray-700 rounded w-28"
          placeholder="Lng"
          value={form.lng}
          onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) })}
        />
        <select
          className="p-2 bg-gray-800 border border-gray-700 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>AC</option>
          <option>DC</option>
        </select>
        <input
          className="p-2 bg-gray-800 border border-gray-700 rounded w-28"
          placeholder="Slots"
          value={form.totalSlots}
          onChange={(e) =>
            setForm({
              ...form,
              totalSlots: parseInt(e.target.value || "1", 10),
            })
          }
        />
        <button
          onClick={create}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
        >
          Create
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-gray-900 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-400">
              [{s.type}] • Slots: {s.totalSlots} • Active: {String(s.active)}
            </p>
            <div className="flex gap-3 mt-3">
              <Link to={"/schedules/" + s.id}>
                <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                  Edit Schedules
                </button>
              </Link>
              <button
                onClick={() => toggleActive(s)}
                className={`px-3 py-1 rounded text-white ${
                  s.active
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {s.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
