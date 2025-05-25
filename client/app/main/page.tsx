"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

interface Location {
  lat: number;
  lng: number;
}

interface Aircraft {
  _id?: string;
  tailNumber: string;
  model: string;
  status: "available" | "aog" | "maintenance";
  location: Location;
}

const initialForm: Aircraft = {
  tailNumber: "",
  model: "",
  status: "available",
  location: { lat: 0, lng: 0 },
};

const AircraftManager = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [formData, setFormData] = useState<Aircraft>(initialForm);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTailNumber, setSelectedTailNumber] = useState<string | null>(null);

  const fetchAircrafts = () => {
    axios
      .get("/api/main")
      .then((res) => setAircrafts(res.data))
      .catch((err) => console.error("Error fetching aircraft:", err));
  };

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isUpdating && selectedTailNumber) {
        await axios.put(`/api/aircraft/${selectedTailNumber}`, formData);
        alert("Aircraft updated!");
      } else {
        await axios.post("/api/main", formData);
        alert("Aircraft added!");
      }
      fetchAircrafts();
      handleClear();
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const handleDelete = (tailNumber: string) => {
    axios
      .delete(`/api/aircraft/${tailNumber}`)
      .then(() => fetchAircrafts())
      .catch((error) => console.error("Delete failed:", error));
  };

  const handleEdit = (aircraft: Aircraft) => {
    setFormData(aircraft);
    setIsUpdating(true);
    setSelectedTailNumber(aircraft.tailNumber);
  };

  const handleClear = () => {
    setFormData(initialForm);
    setIsUpdating(false);
    setSelectedTailNumber(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{isUpdating ? "Update Aircraft" : "Add Aircraft"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          placeholder="Tail Number"
          value={formData.tailNumber}
          onChange={(e) => setFormData({ ...formData, tailNumber: e.target.value })}
          className="block w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="block w-full p-2 border rounded"
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Aircraft["status"] })}
          className="block w-full p-2 border rounded"
        >
          <option value="available">Available</option>
          <option value="aog">AOG</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Latitude"
            value={formData.location.lat}
            onChange={(e) =>
              setFormData({ ...formData, location: { ...formData.location, lat: parseFloat(e.target.value) } })
            }
            className="block w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={formData.location.lng}
            onChange={(e) =>
              setFormData({ ...formData, location: { ...formData.location, lng: parseFloat(e.target.value) } })
            }
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {isUpdating ? "Update Aircraft" : "Add Aircraft"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Clear
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Aircraft Map</h2>
      <div className="w-full h-[500px] mb-10">
        <MapComponent aircrafts={aircrafts} onEdit={handleEdit} />
      </div>

      <h2 className="text-xl font-semibold mb-2">Aircraft List</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Tail #</th>
            <th className="border px-4 py-2">Model</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Lat</th>
            <th className="border px-4 py-2">Lng</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map((aircraft) => (
            <tr key={aircraft.tailNumber}>
              <td className="border px-4 py-2">{aircraft.tailNumber}</td>
              <td className="border px-4 py-2">{aircraft.model}</td>
              <td className="border px-4 py-2">{aircraft.status}</td>
              <td className="border px-4 py-2">{aircraft.location.lat}</td>
              <td className="border px-4 py-2">{aircraft.location.lng}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(aircraft)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(aircraft.tailNumber)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {aircrafts.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No aircraft found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AircraftManager;
