import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate("form");
      }}
    >
      <hi>Map</hi>
      <h1>
        Positions: {lat}, {lng}
      </h1>
      <button onClick={() => setSearchParams({ lat: 23, lng: 48 })}>
        Change Position
      </button>
    </div>
  );
}

export default Map;
