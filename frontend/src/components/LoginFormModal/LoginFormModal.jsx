import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

import './LoginForm.css';


function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();


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
    };

    const DemoUserLogin = () => {
        // setCredential("MatthewCrawley");
        // setPassword("MatthewCrawley");
        // console.log("credential =========>", credential);
        return dispatch(sessionActions.login({ credential: "MatthewCrawley", password: "MatthewCrawley" }))
        .then(closeModal);

    }

    return (
        <div className='login-form-container'>
            <h1>{formType}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    {/* Username or Email */}
                    <input
                        type="text"
                        // value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        placeholder='Username or Email'
                        required
                    />
                </label>
                {/* <div className="errors">{errors.improvement}</div> */}
                <label>
                    {/* Password */}
                    <input
                        type="password"
                        // value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        required
                    />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <button type="submit" className="startButton">{formType}</button>
                <div className='Demouser-login' onClick={DemoUserLogin}>Demo user</div>
            </form>
        </div>
    );
}

export default LoginFormModal;
