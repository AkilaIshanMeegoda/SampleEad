import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Stations() {
  const { api, user } = useAuth();
  const [type, setType] = useState("");
  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");

  const load = async () => {
    const { data } = await api.get("/api/stations", {
      params: { type: type || undefined },
    });
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  async function createBooking(st) {
    const startUtc = prompt("Start (UTC ISO) e.g. 2025-09-28T09:00:00Z");
    const hours = parseInt(prompt("Duration hours e.g. 2") || "1", 10);
    if (!startUtc) return;
    const endUtc = new Date(new Date(startUtc).getTime() + hours * 3600000)
      .toISOString()
      .replace(".000", "")
      .replace("Z", "Z");
    try {
      const { data } = await api.post("/api/bookings", {
        stationId: st.id,
        startUtc,
        endUtc,
      });
      setNote("Booking created: " + data.id);
    } catch (e) {
      setNote("Failed: " + (e.response?.data?.error || "Error"));
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Stations</h2>
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring"
          placeholder="Type (AC/DC)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <button
          onClick={load}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((s) => (
          <div
            key={s.id}
            className="bg-gray-900 rounded-lg p-4 shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="text-sm text-gray-400">
                [{s.type}] • Slots: {s.totalSlots} • Active: {String(s.active)} •
                ({s.lat},{s.lng})
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              {user?.role === "EVOwner" && (
                <button
                  onClick={() => createBooking(s)}
                  className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-white"
                >
                  Book
                </button>
              )}
              {(user?.role === "Backoffice" ||
                user?.role === "StationOperator") && (
                <Link to={"/schedules/" + s.id}>
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                    Schedules
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      {note && <p className="mt-4 text-blue-400">{note}</p>}
    </div>
  );
}
