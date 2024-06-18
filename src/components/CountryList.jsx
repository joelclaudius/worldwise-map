// CountryList.jsx
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length) {
    return <Message message="Add your first city by clicking on the map" />;
  }

  const countries = cities.reduce((arr, city) => {
    if (!arr.some((item) => item.country === city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    }
    return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
}

// CountryList.propTypes = {
//   cities: PropTypes.array.isRequired,
//   isLoading: PropTypes.bool.isRequired,
// };

export default CountryList;
