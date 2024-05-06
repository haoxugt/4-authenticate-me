import { useEffect, useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
// import { Navigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

// import dotenv from 'dotenv'
// dotenv.config();

import './LoginForm.css';


function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [disabledButton, setDisabledButton] = useState(true);
    const { closeModal } = useModal();
    // const navigate = useNavigate();


    // const client_id = process.env.GOOGLE_CLIENT_ID
    // const oauthSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET

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
        setCredential("HaoXu");
        setPassword("HaoXuHaoXu");
    }

    const handleCallbackResponse = (response) => {
        console.log("Encoded JWT ID token: ", response.credential)
    }


    useEffect(() => {
        if (credential.length >= 4 && password.length >= 6) {
            setDisabledButton(false);
        } else {
            setDisabledButton(true);
        }
        setErrors({});
    }, [credential, password]);

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "46240224630-4uo42jo28vnra638o7plr8ple49nu47u.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        )
    }, [])

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
                <a className="oauth-button" href={`${window.origin}/api/oauth/googleOauthLogin`}><FcGoogle /> <span className='google-login'>Continue with Google</span></a>
                <a className="oauth-button" href={`https://abbeys.onrender.com/facebook`}><FaFacebook color='#4267B2'/> <span className='google-login'>Continue with Facebook</span></a>
                <div id="signInDiv"></div>
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
