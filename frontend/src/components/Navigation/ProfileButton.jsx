import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import styles from './navigation.module.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // This keeps our click from bubbling up to the document and triggering 'closeMenu'
        setShowMenu(!showMenu); // if (!showMenu), setShowMenu(true);
    }

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

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const ulClassName = `${styles.profileDropdown} ${showMenu ? "" : styles.hidden}`;

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
}

export default ProfileButton;
