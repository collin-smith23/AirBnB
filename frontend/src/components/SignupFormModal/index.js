import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupFormPage.css'


function SignupFormModal() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
  
    if (sessionUser) return <Redirect to="/" />;

    const validUsername = username.length >= 4;
    const validPassword = password.length >= 6;
    const validConfirmPassword = password === confirmPassword;
    const validEmail = email.length >= 1
    const emailisemail = function(mail){
      let chars = mail.split('')
      if (!chars.includes('@')){
        return false
      }
      else return true
    }
    const usernameNotEmail = function(name){
      let chars = name.split('')
      if (chars.includes('@')){
        return false
      }
      else return true
    }
    const validFirstName = firstName.length >= 1;
    const validLastName = lastName.length >= 1;
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (password === confirmPassword) {
        setErrors([]);
        let currErrs = []
        return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
            if(data.duplicateCredsError){
              // console.log(data)
              currErrs.push(data.duplicateCredsError.message)
            }
            if(data.invalidCredsError){
              // console.log('this is invalid creds', data)
              currErrs.push(data.invalidCredsError.message)
            }
            if(!emailisemail(email)){
              currErrs.push("Invalid email")
            }
            if(!usernameNotEmail(username)){
              currErrs.push("Username cannot be an email")
            }
            if(currErrs){
              setErrors(currErrs)
              console.log(errors)
            }
          });
      }
      return setErrors(['Confirm Password field must be the same as the Password field']);
    };
  
    return (
      <div className='signup-form-box'>
      <form className='signup-form' onSubmit={handleSubmit}>
        {errors.length > 0 && (
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        )}
        <h1>Sign Up</h1>
          <input
            className='signup-input'
            placeholder='Email'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className='signup-input'
            placeholder='Username'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          <input
            className='signup-input'
            placeholder='First Name'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            />
          <input
            className='signup-input'
            placeholder='Last Name'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className='signup-input'
            placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          <input
            className='signup-input'
            placeholder='Confirm Password'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <button className='signup-button' type="submit" disabled={!validUsername || !validEmail || !validFirstName || !validLastName || !validPassword || !validConfirmPassword}>Sign Up</button>
      </form>
            </div>
    );
  }

export default SignupFormModal;