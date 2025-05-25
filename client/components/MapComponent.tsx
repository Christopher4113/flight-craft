"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
}

interface Aircraft {
  tailNumber: string;
  model: string;
  status: "available" | "aog" | "maintenance";
  location: Location;
}

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

export default function MapComponent({
  aircrafts,
  onEdit,
}: {
  aircrafts: Aircraft[];
  onEdit: (a: Aircraft) => void;
}) {
  return (
    <MapContainer center={[20, 0]} zoom={2} className="w-full h-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {aircrafts.map((aircraft) => (
        <Marker
          key={aircraft.tailNumber}
          position={[aircraft.location.lat, aircraft.location.lng]}
          icon={icon}
          eventHandlers={{ click: () => onEdit(aircraft) }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{aircraft.tailNumber}</strong>
              <br />
              Model: {aircraft.model}
              <br />
              Status: {aircraft.status}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
