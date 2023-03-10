const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true})
    .notEmpty()
    .withMessage('Please provide a valid email or username'),
  check('password')
    .exists({ checkFalsy: true})
    .withMessage('Please provide a password'),
    handleValidationErrors
]


// Log in
// router.post('/', validateLogin, async (req, res, next) => {
router.post('/', async (req, res, next) => {
  const { credential, password} = req.body;



  let invalidCredsError = {
    "message": "Validation error",
    "statusCode": 400,
    "errors": {}
  }

  if (!req.body.credential || req.body.credential === '') {
    invalidCredsError.errors.credential =  "Email or username is required";

  }
  if (!req.body.password || req.body.password === '') {
   invalidCredsError.errors.password = "Password is required"
  }

  if(invalidCredsError.errors.hasOwnProperty('credential') || invalidCredsError.errors.hasOwnProperty('password')){
    return res.status(400).json({invalidCredsError})
  }


  const user = await User.login({ credential, password });

  if (!user) {
    res.status(401)
    return res.json({
      "message": "Invalid credentials",
      "statusCode": 401
    })
  }


  await setTokenCookie(res, user);

  return res.json({
    user
  });
});

//Log out
router.delete('/', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success'})
});

router.get('/', restoreUser, (req, res) => {
  const { user } = req;

  if (user) {
    return res.json({
      user: user.toSafeObject()
    });
  } else return res.json({});
});


module.exports = router;
