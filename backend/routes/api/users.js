const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true})
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .isLength({ min:4 })
    .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email'),
    check('username')
      .exists({ checkFalsy: true})
      .withMessage("Username is required"),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
      check("firstName")
      .exists({ checkFalsy: true})
      .withMessage("First name is required"),
      check("lastName")
      .exists({ checkFalsy: true})
      .withMessage("Last name is required"),
      handleValidationErrors
];

// Sign up

router.post( '/', validateSignup, async (req, res) => {
// router.post( '/', async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;

  const emailExist = await User.findOne({where: {email}});
  const usernameExist = await User.findOne({where: {username}});



  // let invalidCredsError = {
  //   "message": "Validation error",
  //   "statusCode": 400,
  //   "errors": {}
  // }
  let duplicateCredsError = {
    "message": "User already exists",
    "statusCode": 403,
    "errors": {}
  }

  // if (!email || email === ""){
  //   invalidCredsError.errors = {
  //     "email": "Invalid email"
  //   }
  //   return res.json({invalidCredsError})
  // }
  // if (!username || username === ""){
  //   invalidCredsError.errors = {
  //     "username": "Username is required"
  //   }
  //   return res.json({invalidCredsError})
  // }
  // if (!firstName || firstName === ""){
  //   invalidCredsError.errors = {
  //     "firstName": "First Name is required"
  //   }
  //   return res.json({invalidCredsError})
  // }
  // if (!lastName || lastName === ""){
  //   invalidCredsError.errors = {
  //     "lastName": "Last Name is required"
  //   }
  //   return res.json({invalidCredsError})
  // }

  // if (emailExist && usernameExist){
  //   duplicateCredsError.errors = {
  //     "email": "User with that email already exists",
  //     "username": "User with that username already exists"
  //   }
  //   return res.json({duplicateCredsError})
  // }

  if (emailExist){
    duplicateCredsError.errors = {
      "email": "User with that email already exists"
    }
    return res.json({duplicateCredsError})
  }
  if (usernameExist){
    duplicateCredsError.errors = {
      "username": "User with that username already exists"
    }
    return res.json({duplicateCredsError})
  }



  if (!emailExist && !usernameExist) {
    const user = await User.signup({ firstName, lastName, email, username, password });
   const token = await setTokenCookie(res, user);
    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token: token
    })
  }
});

module.exports = router;
