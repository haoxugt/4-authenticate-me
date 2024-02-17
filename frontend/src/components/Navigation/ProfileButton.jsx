import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { GiHamburgerMenu } from "react-icons/gi";
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
// import OpenModalButton from '../OpenModalButton';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const createSpot = (e) => {
    e.preventDefault();
    // dispatch(sessionActions.logout());
    // closeMenu();
    console.log("==============");
    <Navigate to="/spots/new" replace={true} />;
  };

  const managerSpots = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='right-memu-container'>
      {user && (
        <button className='creat-spot-button' onClick={createSpot}>Create a Spot</button>
      )}
      <button className='user-icons-container' onClick={toggleMenu}>
        <GiHamburgerMenu size={16} color="grey"/>
        <FaUserCircle size={30} color="grey" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <p>Hi, {user.firstName}</p>
            {/* <p onClick={createSpot}>Create a Spot</p> */}
            <p onClick={managerSpots}>Manager Spots</p>
            <p onClick={logout}>Log Out</p>
          </>
        ) : (
          <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
