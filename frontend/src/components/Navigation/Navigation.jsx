import styles from "./navigation.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <NavLink to="/" className={styles.navLink}>Home</NavLink>
        </li>
      </ul>
      {isLoaded && (
        <div className={styles.profileButtonWrapper}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
