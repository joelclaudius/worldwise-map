import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useState, useEffect } from "react";
import { useCities } from "../context/CitiesContext";

function Map() {
  const { cities } = useCities();

  const [searchParams] = useSearchParams();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  // Correct retrieval of lat and lng from search params
  const mapLat = parseFloat(searchParams.get("lat"));
  const mapLng = parseFloat(searchParams.get("lng"));

  // Validate the lat and lng values
  const isValidLat = !isNaN(mapLat) && mapLat >= -90 && mapLat <= 90;
  const isValidLng = !isNaN(mapLng) && mapLng >= -180 && mapLng <= 180;

  useEffect(() => {
    if (isValidLat && isValidLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng, isValidLat, isValidLng]);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapPosition} // Use validated map position
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji} </span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {/* Only attempt to change center if valid coordinates are provided */}
        {isValidLat && isValidLng && (
          <ChangeCenter position={[mapLat, mapLng]} />
        )}
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    // Update map view if position is valid
    if (position && position[0] !== null && position[1] !== null) {
      map.setView(position);
    }
  }, [map, position]);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({ click: (e) => navigate("form") });
}

export default Map;
