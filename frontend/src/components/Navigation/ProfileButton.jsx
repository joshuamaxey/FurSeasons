import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import styles from './navigation.module.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    //^  'dispatch' is used to dispatch actions to the Redux store. We have a showMenu state variable (slice of state) to manage the visibility of the dropdown menu. Initially it is set to false, so the menu is hidden by default. ulRef is a reference to the <ul></ul> element, used to determine if a click happened outside of this element.

    const toggleMenu = (e) => {
        e.stopPropagation(); // This keeps our click from bubbling up to the document and triggering 'closeMenu'
        setShowMenu(!showMenu); // if (!showMenu), setShowMenu(true);
    }
    //^ Our toggleMenu function toggles the visibility of the dropdown menu. It also stops the event from propagating to the document, which could inadvertently close the menu.

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);
    //^ This useEffect() runs when showMenu changes.
    // Our closeMenu function checks if the click happened outside the < ul ></ul > element.If it did, it sets 'showMenu' to false, hiding the menu.
    // Then we attach a click event listener to the document to detect outside clicks and clean up after the component unmounts.

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };
    //^ Dispatches the logout action to log the user out when called

    const ulClassName = `${styles.profileDropdown} ${showMenu ? "" : styles.hidden}`;
    //^ Combine the base class for the dropdown menu with a conditional class. If 'showMenu' is false, it adds the 'hidden' class to hide the menu.

    return (
        <>
            <button className={styles.profileButton} onClick={toggleMenu}>
                <FaUserCircle />
            </button>
            <ul ref={ulRef} className={ulClassName}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>
    );
    //^ Our button here renders the profile button with an icon. WHen clicked, it toggles the menu visibility using our toggleMenu function. Then we use a <ul></ul> to render the dropdown menu. THe 'ref' attaches the ulRef reference to this eleemnt, and className applies the appropriate styling. THe <li></li> elements display user information with a logout button within the dropdown menu.
}

export default ProfileButton;
