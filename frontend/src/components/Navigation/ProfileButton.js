import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user)
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current || !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false)
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
        <li className="logged-in">Hello, {user.firstName}</li>
        <li className="logged-in">{user.email}</li>
        <NavLink to='/spots/current' className='manage-spots' onClick={closeMenu}>ManageSpots</NavLink>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
          </>
        ) : (
          <>
          <OpenModalMenuItem
          className='session-links'
          itemText='Log In'
          onItemClick={closeMenu}
          modalComponent={<LoginFormModal />}
          />
          <OpenModalMenuItem
          className='session-links'
          itemText='Sign Up'
          onItemClick={closeMenu}
          modalComponent={<SignupFormModal />}
          />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;