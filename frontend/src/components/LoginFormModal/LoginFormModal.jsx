import styles from "./loginForm.module.css";
import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  // Here we check to see if the credential and password are the required lengths. If not, we disable the button until they are.
  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [credential, password]);

  // Here we try to login using the provided credential and password. If the login is successful, we close the modal. If not, we set the errors and will display them on the form.
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  // Next we define a function that will log the user in as the demo user. We'll use this later in our 'Log in as Demo User' button.
  const handleDemoLogin = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1 className={styles.heading}>Log In</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.credential && (
          <p className={styles.error}>{errors.credential}</p>
        )}
        <button type="submit" className={styles.button} disabled={isButtonDisabled}>Log In</button>
        <button onClick={handleDemoLogin} className={styles.demoButton}>Log in as Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
