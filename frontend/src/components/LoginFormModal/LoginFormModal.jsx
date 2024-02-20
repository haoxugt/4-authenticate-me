import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
// import { Navigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

import './LoginForm.css';


function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [disabledButton, setDisabledButton] = useState(true);
    const { closeModal } = useModal();
    // const navigate = useNavigate();


    const formType = "Log In";

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
        // return (<Navigate to='/' />);
    };

    const DemoUserLogin = () => {
        setCredential("RobertCrawley");
        setPassword("RobertCrawley");
    }
    const DemoUserLogin2 = () => {
        setCredential("MatthewCrawley");
        setPassword("MatthewCrawley");
    }


    useEffect(() => {
        if (credential.length >= 4 && password.length >= 6) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
        setErrors({});
    }, [credential, password]);

    return (
        <div className='login-form-container'>
            <h1>{formType}</h1>
            <form onSubmit={handleSubmit}>
                {errors.credential && <p className='errors'>{errors.credential}</p>}
                <div className='label-container'>
                    <label>
                        {/* Username or Email */}
                        <input
                            id="login-credential-input"
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            placeholder='Username or Email'
                            required
                        />
                    </label>
                    {/* <div className="errors">{errors.improvement}</div> */}
                    <label>
                        {/* Password */}
                        <input
                            id="login-password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                    </label>
                </div>

                <button type="submit"
                    className="startButton"
                    disabled={disabledButton}>
                    {formType}
                </button>
                <button className='Demouser-login' onClick={DemoUserLogin}>
                    Log in as Demo User
                </button>
                <button className='Demouser-login' onClick={DemoUserLogin2}>
                    Log in as Demo User 2
                </button>
            </form>
        </div>
    );
}

export default LoginFormModal;
