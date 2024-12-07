import styles from "./navigation.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CreateSpot from "./CreateSpot";
import catIcon from "../../../src/cat_icon.png"

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <NavLink to="/" className={styles.navLink}>
            <img src={catIcon} alt="Home" className={styles.navIcon} id={styles.icon} />
          </NavLink>
        </li>
      </ul>
      {isLoaded && (
        <div className={styles.actions}>
          {sessionUser && <CreateSpot />} {/* Render CreateSpot when user is logged in */}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
