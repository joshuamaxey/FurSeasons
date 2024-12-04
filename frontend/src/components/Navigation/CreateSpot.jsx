import { NavLink } from 'react-router-dom';
import styles from './CreateSpot.module.css';

const CreateSpot = () => {
  return (
    <NavLink to="/spots/new" className={styles.createSpotButton}>
      Create a New Spot
    </NavLink>
  );
};

export default CreateSpot;
