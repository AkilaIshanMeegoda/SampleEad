import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function SchedulesEditor() {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [station, setStation] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/api/stations/" + id).then((r) => {
      setStation(r.data);
      setSchedules(r.data.schedules || []);
    });
  }, [id]);

  const canEditWindows = user?.role === "Backoffice";
  const onChange = (i, field, val) => {
    setSchedules(
      schedules.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );
  };
  const addWindow = () =>
    setSchedules([...schedules, { startUtc: "", endUtc: "", availableSlots: 0 }]);

  const save = async () => {
    setMsg("");
    try {
      await api.put("/api/stations/" + id + "/schedules", { schedules });
      setMsg("Saved");
    } catch (e) {
      setMsg("Error: " + (e.response?.data?.error || "Failed"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Schedules for {station?.name}
      </h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-3 py-2 text-left">StartUtc</th>
            <th className="px-3 py-2 text-left">EndUtc</th>
            <th className="px-3 py-2 text-left">Available</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {schedules.map((s, i) => (
            <tr key={i}>
              <td className="px-3 py-2">
                {canEditWindows ? (
                  <input
                    className="w-full p-1 bg-gray-800 border border-gray-700 rounded"
                    value={s.startUtc}
                    onChange={(e) => onChange(i, "startUtc", e.target.value)}
                  />
                ) : (
                  s.startUtc
                )}
              </td>
              <td className="px-3 py-2">
                {canEditWindows ? (
                  <input
                    className="w-full p-1 bg-gray-800 border border-gray-700 rounded"
                    value={s.endUtc}
                    onChange={(e) => onChange(i, "endUtc", e.target.value)}
                  />
                ) : (
                  s.endUtc
                )}
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  className="w-24 p-1 bg-gray-800 border border-gray-700 rounded"
                  value={s.availableSlots}
                  onChange={(e) =>
                    onChange(
                      i,
                      "availableSlots",
                      parseInt(e.target.value || "0", 10)
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-3 mt-4">
        {canEditWindows && (
          <button
            onClick={addWindow}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Add Window
          </button>
        )}
        <button
          onClick={save}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white"
        >
          Save
        </button>
      </div>

      {msg && <p className="mt-3 text-green-500">{msg}</p>}
    </div>
  );
}
