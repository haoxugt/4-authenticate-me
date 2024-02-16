import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { Navigate } from "react-router-dom";
import * as sessionActions from '../../store/session';

import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
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
      confirmPassword: "Confirm Password field must be the same as the Password field"

    })

  };

  return (
    <div className='signup-form-container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          {/* Email */}
          <input
            type="email"
            // value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          <input
            type="text"
            // value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          <input
            type="text"
            // value={email}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
            required
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          <input
            type="text"
            // value={email}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
            required
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          <input
            type="password"
            // value={email}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          <input
            type="password"
            // value={email}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
            required
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">{formType}</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
