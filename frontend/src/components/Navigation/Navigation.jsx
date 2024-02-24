import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';

import './Navigation.css'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // if (sessionUser) {
  //   document.title = "Abbey";
  //   const favicon = document.getElementById('favicon');
  //   favicon.setAttribute('href', '/logo.png');
  // }
  return (
    <nav className="nav-container">
      <div className="nav-inner-container">
      <div>
        <NavLink to="/">
          {/* {sessionUser ?
            <img style={{ height: "45px" }} src='/logo_large.png' alt='Abbey logo' /> :
            <img style={{ height: "40px" }} src='/Airbnb_Logo.svg' alt='Airbnb logo' />
          } */}
          <img style={{ height: "45px" }} src='/logo_large.png' alt='Abbey logo' />
        </NavLink>
      </div>
      {isLoaded && (
        <div className="profile-button-container">
          <ProfileButton className="profile-button" user={sessionUser} />
        </div>
      )}
      </div>
    </nav>
  );
}

export default Navigation;
