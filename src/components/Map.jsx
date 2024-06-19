import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  // Correct retrieval of lat and lng from search params
  const [mapLat, mapLng] = useUrlPosition();

  // Validate the lat and lng values
  const isValidLat = !isNaN(mapLat) && mapLat >= -90 && mapLat <= 90;
  const isValidLng = !isNaN(mapLng) && mapLng >= -180 && mapLng <= 180;

  useEffect(() => {
    if (isValidLat && isValidLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng, isValidLat, isValidLng]);

  useEffect(() => {
    if (geoLocationPosition) {
      const { lat, lng } = geoLocationPosition;
      setMapPosition([lat, lng]);
      // Update the URL with the new position
      navigate(`?lat=${lat}&lng=${lng}`);
    }
  }, [geoLocationPosition, navigate]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition} // Use validated map position
        zoom={6}
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
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] !== null && position[1] !== null) {
      map.setView(position, map.getZoom());
    }
  }, [map, position]);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log("Map clicked at:", { lat, lng });
      navigate(`form?lat=${lat}&lng=${lng}`);
    },
  });
}

export default Map;
