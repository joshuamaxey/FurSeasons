import React from 'react';
import styles from './SplashPage.module.css'

const SplashPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to Bed and Breakfast!</h1>
            <p className={styles.description}>Discover Amazing New Spots and Experiences!</p>
            <button className={styles.button}>Get Started</button>
        </div>
    )
}

export default SplashPage;
