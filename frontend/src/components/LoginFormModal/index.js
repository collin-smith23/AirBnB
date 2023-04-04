import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useModal } from '../../context/Modal'
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal()

  // if (sessionUser) return (
  //   <Redirect to="/" />
  // );

const validUser = credential.length >= 4;
const validPassword = password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {setErrors(data.errors)}
        else {
          setErrors(["The provided credentials are invalid"]);
        console.log(data)
        }
      });
  }

  return (
    <>
    <h1>Log In</h1>
    <form className='login-form' onSubmit={handleSubmit}>
      <ul className='errors'>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label className='credentials'>
        {/* Username or Email */}
        <input className='input-box'
          type="text"
          placeholder='Username or Email'
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
          />
      </label>
      <label className='credentials'>
        {/* Password */}
        <input className='input-box'
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          />
      </label>
      <button className='login-button' type="submit" disabled={!validPassword || !validUser}>Log In</button>
    </form>
          </>
  );
}

export default LoginFormModal;