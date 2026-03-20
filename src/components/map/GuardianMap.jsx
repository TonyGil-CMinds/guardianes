import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const limeIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;background:#BFFF00;border:3px solid #1a1a1a;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function GuardianMap({ guardians }) {
  const validGuardians = guardians.filter(
    (g) => g.latitude && g.longitude
  );

  const center =
    validGuardians.length > 0
      ? [validGuardians[0].latitude, validGuardians[0].longitude]
      : [4.6, -74.1];

  return (
    <div className="w-full h-[calc(100vh-80px)] rounded-2xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={3}
        className="w-full h-full"
        style={{ borderRadius: "1rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {validGuardians.map((g) => (
          <Marker key={g.id} position={[g.latitude, g.longitude]} icon={limeIcon}>
            <Popup>
              <div className="text-center p-1">
                {g.image_url && (
                  <img
                    src={g.image_url}
                    alt={g.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                )}
                <p className="font-semibold text-sm">{g.name}</p>
                <p className="text-xs text-gray-500">
                  {g.role}
                  {g.organization && ` · ${g.organization}`}
                </p>
                {g.country && (
                  <p className="text-xs text-gray-400 mt-1">{g.country}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}