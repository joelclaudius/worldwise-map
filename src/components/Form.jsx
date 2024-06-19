import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import { useUrlPosition } from "../Hooks/useUrlPosition";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [mapLat, mapLng] = useUrlPosition();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (!mapLat || !mapLng) return;
    const fetchCityData = async () => {
      try {
        setIsLoadingGeocoding(true);
        const res = await fetch(
          `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
        );
        const data = await res.json();
        console.log(data);
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        console.error("Error loading city data:", err);
      } finally {
        setIsLoadingGeocoding(false);
      }
    };
    fetchCityData();
  }, [mapLat, mapLng]); // Fetch data when lat or lng changes

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          disabled={isLoadingGeocoding} // Disable input while loading
        />
        <span className={styles.flag}>{emoji}</span>
      </div>
      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {isLoadingGeocoding && <Spinner />} {/* Show spinner if loading */}
      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
