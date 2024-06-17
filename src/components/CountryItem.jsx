// CountryItem.jsx
import PropTypes from "prop-types";
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

CountryItem.propTypes = {
  country: PropTypes.shape({
    emoji: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
};

export default CountryItem;
