const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const { environment } = require('./config');
const isProduction = environment === 'production';
const { ValidationError } = require('sequelize');


const app = express();

// facebook -login
const passport = require('passport');
// const Strategy = require('passport-facebook').Strategy;
const FacebookStrategy = require('passport-facebook');
const { User } = require('./db/models');
const { Op } = require('sequelize');
// const config = require('./config');

// passport.use(new Strategy({
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
    state: true
    // passReqToCallback: true,
    // proxy: true
  },
  async function(accessToken, refreshToken, profile, cb) {
    // save the profile on the Database
    // Save the accessToken and refreshToken if you need to call facebook apis later on
    const user = await User.findOne({
        where: {
            [Op.or]: {
              username: profile.displayName,
              username: profile.displayName
            //   email: profile.email
            }
          }
    });
    console.log("profile ====>", profile)
    const firstName = profile.displayName.split(' ')[0]; //Extract the user's first name
    const lastName = profile.displayName.split(' ')[1]; // Extract the user's last name

    let safeUser = {};
    if (!user) {
        console.log('Adding new facebook user to DB..');
        user = await User.create({
            email: profile.email || 'test@gmail.com',
            username: profile.displayName,
            firstName,
            lastName
        });
        // const user = new User({
        //   accountId: profile.id,
        //   name: profile.displayName,
        //   provider: profile.provider,
        // });
        // await user.save();
        console.log("new user ===>", user);
        safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
          };
        return cb(null, profile);
      } else {
        console.log('Facebook User already exist in DB..');
        // console.log(profile);
        safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        return cb(null, profile);
      }
    // return cb(null, profile);
  }));

//   passport.serializeUser(function(user, cb) {
//     cb(null, user);
//   });

//   passport.deserializeUser(function(obj, cb) {
//     cb(null, obj);
//   });

  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/facebook', passport.authenticate('facebook', { scope: ['email']}));
  app.get('/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: `${process.env.FACEBOOK_CALLBACK_URL}/error`
    }), (req, res) => {
    // res.send(`${process.env.FACEBOOK_CALLBACK_URL}/success`);
    res.send('/');
  }) ;

// =============================================

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());


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

// routes
app.use(routes);

// Error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
});

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        // title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        // stack: isProduction ? null : err.stack
    });
});

module.exports = app;
