import styles from "./signupForm.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const { closeModal } = useModal();

  // Here we check to make sure that none of the form fields are empty and that they are the correct number of characters. If either of these conditions is false, we disable the submit button.
  useEffect(() => {
    if (
      email &&
      username.length >= 4 &&
      firstName &&
      lastName &&
      password.length >= 6 &&
      confirmPassword.length >= 6
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, username, firstName, lastName, password, confirmPassword]);

  // We dispatch the signup action with the information in the form, then close the modal. If there are errors, we keep track of them and will display them in our component later.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    // Forgot to also set validation for the confirmPassword box, so that's what this code is doing.
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <h1 className={styles.heading}>Sign Up</h1>
        <label className={styles.label}>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </label>
        <label className={styles.label}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </label>
        <label className={styles.label}>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
          {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
        </label>
        <label className={styles.label}>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={styles.input}
          />
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={styles.input}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </label>
        <label className={styles.label}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className={styles.input}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </label>
        <button type="submit" className={styles.button} disabled={isButtonDisabled}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
