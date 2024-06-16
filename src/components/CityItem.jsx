// CityItem.jsx
import PropTypes from "prop-types";

import styles from "./CityItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { cityName, emoji, date } = city; //eslint disable

  return (
    <li className={styles.cityItem}>
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.cityName}>{cityName}</h3>
      <time className={styles.date}>({formatDate(date)})</time>
      <button className={styles.deleteBtn}>&times;</button>
    </li>
  ); // Assuming city has a 'name' property
}

CityItem.propTypes = {
  city: PropTypes.object, // Adjust the shape as per your 'city' object
};

export default CityItem;
