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
    <div>
      <h2>Admin Stations</h2>
      <div>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Lat"
          value={form.lat}
          onChange={(e) =>
            setForm({ ...form, lat: parseFloat(e.target.value) })
          }
        />
        <input
          placeholder="Lng"
          value={form.lng}
          onChange={(e) =>
            setForm({ ...form, lng: parseFloat(e.target.value) })
          }
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>AC</option>
          <option>DC</option>
        </select>
        <input
          placeholder="Total Slots"
          value={form.totalSlots}
          onChange={(e) =>
            setForm({
              ...form,
              totalSlots: parseInt(e.target.value || "1", 10),
            })
          }
        />
        <button onClick={create}>Create</button>
      </div>
      <div>
        {items.map((s) => (
          <div
            key={s.id}
            style={{ border: "1px solid #ddd", padding: 8, margin: "8px 0" }}
          >
            <b>{s.name}</b> [{s.type}] Slots:{s.totalSlots} Active:
            {String(s.active)}{" "}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <Link to={"/schedules/" + s.id}>
                <button>Edit Schedules</button>
              </Link>
              <button onClick={() => toggleActive(s)}>
                {s.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
