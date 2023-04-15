import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import logo from './logoImg/myAirBnBLogo.png'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const spots = useSelector(state => state.spots);



  return (
    <div className='nav-bar'>
    <ul className='home-button-container'>
      <li className='home-button-logo'>
        <NavLink exact to="/" >
          <img className ='logo-image' src={logo}/>
        </NavLink>
      </li>
    </ul>
    <div className='create-spot-button-box'>
        {isLoaded && sessionUser && (
          <NavLink to='/spots/new'>
              <span className='create-spot-button' >Create a Spot</span>
            </NavLink>
        )}
        </div>
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