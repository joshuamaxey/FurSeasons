import styles from "./navigation.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import CreateSpot from "./CreateSpot";
import catIcon from "../../../src/cat_icon.png"

function Navigation({ isLoaded }) { // Navigation is a function component that takes a single prop: isLoaded
  const sessionUser = useSelector((state) => state.session.user); // We use the useSelector hook from React Redux to access the curent user (sessionUser) from the state

  return ( // We return the navigation bar.
    <nav className={styles.navContainer}>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <NavLink to="/" className={styles.navLink}>
            {/* Our home button navigates to the homepage, and is rendered as our cat button */}
            <img src={catIcon} alt="Home" className={styles.navIcon} id={styles.icon} />
          </NavLink>
        </li>
      </ul>
      {/* Below, we will check if the current user session has been loaded and whether or not there is a logged-in sessionUser. If both are true, we render the create a spot button with the profile button dropdown. If there is no logged-in user, then we render only the profile button dropdown once the user session has been loaded. */}
      {isLoaded && (
        <div className={styles.actions}>
          {sessionUser && <CreateSpot />}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

// isLoaded is defined in App.jsx. It checks whether the session data has been loaded. Our restoreUser action in the useEffect hook of the Layout component tries to restore the user's session. This either results in a logged-in user (setting user data) or no user (session data loaded, but no active user). Once the session restoration process finishes, isLoaded is set to true. In this case, the Navigation component receives the isLoaded prop. Navigation then checks to see if there is an authenticated sessionUser logged in. If so, we conditionally render the Create a New Spot button. If not, we render the profile button dropdown without the Create a New Spot button.

export default Navigation;
