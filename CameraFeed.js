import React, { useState, useEffect } from "react";

const CameraFeed = () => {
  const [detectedPlate, setDetectedPlate] = useState("");
  const [status, setStatus] = useState("Waiting for detection...");

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:5000/check_plate");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectedPlate(data.carPlate);
      setStatus(data.allowed ? "✅ Access Granted" : "❌ Access Denied");
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">License Plate Recognition</h2>
      <div className="border p-5 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold">Detected Plate:</h3>
        <p className="text-xl font-bold">{detectedPlate}</p>
        <h3 className="text-lg font-semibold mt-3">Status:</h3>
        <p className="text-xl font-bold">{status}</p>
      </div>
    </div>
  );
};

export default CameraFeed;
