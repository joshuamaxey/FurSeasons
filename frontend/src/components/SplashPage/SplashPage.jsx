import styles from './SplashPage.module.css'
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/spots');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to Bed and Breakfast!</h1>
            <p className={styles.description}>Discover Amazing New Spots and Experiences!</p>
            <button className={styles.button} onClick={handleGetStarted}>Get Started</button>
        </div>
    )
}

export default SplashPage;
