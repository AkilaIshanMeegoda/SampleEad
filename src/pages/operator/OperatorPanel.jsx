import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import QRCode from "qrcode.react";

export default function OperatorPanel() {
  const { api } = useAuth();
  const [bookingId, setBookingId] = useState("");
  const [qr, setQr] = useState("");
  const [scanPayload, setScanPayload] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [msg, setMsg] = useState("");

  const approve = async () => {
    setMsg("");
    setQr("");
    try {
      const { data } = await api.post(
        "/api/bookings/" + bookingId + "/approve"
      );
      setQr(data.qrPayload);
    } catch {
      setMsg("Error approving booking");
    }
  };

  const scan = async () => {
    setMsg("");
    setScanResult(null);
    try {
      const { data } = await api.post("/api/bookings/scan", {
        qrPayload: scanPayload,
      });
      setScanResult(data);
    } catch {
      setMsg("Invalid QR");
    }
  };

  const complete = async () => {
    setMsg("");
    try {
      await api.post("/api/bookings/" + bookingId + "/complete");
      setMsg("Completed.");
    } catch {
      setMsg("Error completing booking");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-900 p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold">Operator Panel</h2>

      {/* Approve/Complete */}
      <div className="flex gap-3">
        <input
          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
        <button
          onClick={approve}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white"
        >
          Approve → QR
        </button>
        <button
          onClick={complete}
          className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-white"
        >
          Complete
        </button>
      </div>

      {qr && (
        <div className="bg-gray-800 p-4 rounded">
          <p className="text-sm text-gray-400">QR Payload:</p>
          <code className="block break-words text-blue-400">{qr}</code>
          <div className="mt-3 flex justify-center">
            <QRCode value={qr} size={180} />
          </div>
        </div>
      )}

      {/* Scan */}
      <div>
        <h3 className="text-lg font-medium mb-2">Scan (simulate)</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Paste QR payload here"
            value={scanPayload}
            onChange={(e) => setScanPayload(e.target.value)}
          />
          <button
            onClick={scan}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-white"
          >
            Verify
          </button>
        </div>
      </div>

      {scanResult && (
        <pre className="bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap">
          {JSON.stringify(scanResult, null, 2)}
        </pre>
      )}

      {msg && <p className="text-red-400">{msg}</p>}
    </div>
  );
}
