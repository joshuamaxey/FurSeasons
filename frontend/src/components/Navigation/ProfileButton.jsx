import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import styles from './navigation.module.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    return (
        <>
            <button className={styles.profileButton}>
                <FaUserCircle />
            </button>
            <ul className={styles.profileDropdown}>
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
