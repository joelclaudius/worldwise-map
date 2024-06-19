import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "./Button";
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
import { useGeolocation } from "../Hooks/useGeolocation";
import { useUrlPosition } from "../Hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]); // Default position

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  // Extract and validate URL parameters
  const { lat: mapLat, lng: mapLng } = useUrlPosition();
  const isValidLat = !isNaN(mapLat) && mapLat >= -90 && mapLat <= 90;
  const isValidLng = !isNaN(mapLng) && mapLng >= -180 && mapLng <= 180;

  // Update map position from URL parameters if valid
  useEffect(() => {
    if (isValidLat && isValidLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng, isValidLat, isValidLng]);

  // Update map position from geolocation when available
  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button
          type="position"
          onClick={() => {
            console.log("Button clicked to get position");
            getPosition();
          }}
        >
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition} // Use the current map position state
        zoom={12} // Adjust zoom level as needed
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
        {/* Change the center of the map to the updated position */}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom()); // Maintain current zoom level
  }, [map, position]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
