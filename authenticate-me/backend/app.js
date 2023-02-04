//import packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
//checking if environment is in production
const { environment } = require('./config');
const isProduction = environment === 'production';
//initializing Express app
const app = express();
//require routes
const routes = require('./routes');
//connecting morgan middleware
app.use(morgan('dev'));
//adding parsers
app.use(cookieParser());
app.use(express.json());
//adding security middleware
// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

app.use(routes)

module.exports = app
