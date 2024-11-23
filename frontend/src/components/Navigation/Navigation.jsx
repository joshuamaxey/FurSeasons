import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import * as sessionActions from "../../store/session";
import styles from "./navigation.module.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
      <li>
        <button className={styles.navLink} onClick={logout}>
          Log Out
        </button>
      </li>
    </>
  ) : (
    <>
      <li>
        <NavLink className={styles.navLink} to="/login">
          Login
        </NavLink>
      </li>
      <li>
        <NavLink className={styles.navLink} to="/signup">
          Sign Up
        </NavLink>
      </li>
    </>
  );
  return (
    <div className={styles.navContainer}>
      <ul className={styles.navLinks}>
        <li>
          <NavLink className={styles.navLink} to="/">
            Home
          </NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </div>
  );
}

export default Navigation;
