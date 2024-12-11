import styles from './navigation.module.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(); // here, ulRef will be a DOM element (our dropdown menu)

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return; // if showMenu is false, stop code execution. This means that we only add the event listener to the page when the menu is open.

    // If the click (e, event) occurs anywhere that is not inside of the ulRef element (our dropdown menu), we close the menu. If we click inside the dropdown menu, nothing happens.
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu); // When we click anywhere on the page, close the profilemenu dropdown.

    return () => document.removeEventListener("click", closeMenu); // cleanup function to remove the event listener after we've closed the menu.
  }, [showMenu]);

  // Here we create a logout function to dispatch the logout action from the session slice of state in our store.
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      setShowMenu(false); // Close the dropdown menu
      navigate('/'); // Redirect to homepage after logout
    });
  };

  // Here we apply the 'profileDropdown' className to our ul elements below for consistent styling. Then, we conditionally apply the 'hidden' class to the dropdown menu based on the value of showMenu. If showMenu is true, hidden is not applied. If it is false, then we apply the hidden class to hide the dropwon menu.
  const ulClassName = `${styles.profileDropdown} ${!showMenu ? styles.hidden : ''}`;

  return (
    <div className={styles.profileButtonContainer}>
      <button onClick={toggleMenu} className={styles.profileButton}>
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className={styles.greeting}>Hello, {user.username}</li>
            <li className={styles.email}>{user.email}</li>
            <hr></hr>
            <li>
              <NavLink to="/spots/manage" className={styles.navLink}>Manage Spots</NavLink>
            </li>
            <li>
              <NavLink to="/reviews/current" className={styles.navLink}>Manage Reviews</NavLink>
            </li>
            <hr></hr>
            <li>
              <button className={styles.logout} onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
