import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session';

import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [diabledSignup, setDisabledSignup] = useState(true);
  const { closeModal } = useModal();


  const formType = "Sign Up";

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
          password
        })
      ).then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      ...errors,
      confirmPassword: "Confirm Password field must be the same as the Password field"

    })

  };

  useEffect(() => {
      if (email.length > 0 && username.length > 0 &&
    firstName.length > 0 && lastName.length > 0 &&
    password.length > 0 && confirmPassword.length > 0) {
      setDisabledSignup(false);
    } else {
      setDisabledSignup(true)
    }
  } , [email,
    username,
    firstName,
    lastName,
    password,
    confirmPassword
  ]);

  return (
    <div className='signup-form-container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          {/* Email */}
          <input
            id='signup-email-input'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
          />
        </label>
        {errors.email && <p className='errors'>{errors.email}</p>}
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            // required
          />
        </label>
        {errors.username && <p className='errors'>{errors.username}</p>}
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
            // required
          />
        </label>
        {errors.firstName && <p className='errors'>{errors.firstName}</p>}
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
            // required
          />
        </label>
        {errors.lastName && <p className='errors'>{errors.lastName}</p>}
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            // required
          />
        </label>
        {errors.password && <p className='errors'>{errors.password}</p>}
        <label>
          <input
          id='signup-confirmedpassword-input'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
            // required
          />
        </label>

        {errors.confirmPassword && <p className='errors'>{errors.confirmPassword}</p>}
        <button type="submit" className="startButton" disabled={diabledSignup}>{formType}</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
