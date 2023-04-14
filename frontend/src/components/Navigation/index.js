import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import * as sessionActions from '../../store/session';
import logo from './logoImg/myAirBnBLogo.png'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);



  return (
    <div className='nav-bar'>
    <ul className='home-button-container'>
      <li className='home-button-logo'>
        <NavLink exact to="/" >
          <img className ='logo-image' src={logo}/>
        </NavLink>
      </li>
    </ul>
    <ul className='nav-bar-items'>
      <li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      </li>
    </ul>
    </div>
  );
}

export default Navigation;