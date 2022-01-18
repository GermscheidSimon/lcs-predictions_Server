const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _mongo_user = require('../mongo/users')
const crypt = require('./bcrypt')

passport.serializeUser((user, done) => {
    done(null, user);
  });

passport.deserializeUser( async (id, done) => {
    const userObj  = await _mongo_user.getUser(id)
    try {
        if (userObj ) {
            // user found
            done(null, userObj );
          } else {
            // user not found
            // done takes an error (null in this case) and a user (also null in this case)
            // this will result in the server returning a 401 status code
            done(null, null);
          }
    } catch (error) {
        console.log('Error with query during deserializing user ', error);
        // done takes an error (we have one) and a user (null in this case)
        // this will result in the server returning a 500 status code
        done(error, null);
    }
});

// Does actual work of logging in
passport.use(
  'local',
  new LocalStrategy(async (username, password, done) => {

    try {
        const user = await _mongo_user.getUserByUsername(username)
            if(user && await crypt.authenticateUser(password, user.password)){
                // All good! Passwords match!
                // done takes an error (null in this case) and a user
                done(null, user);
              } else {
                // Not good! Username and password do not match.
                // done takes an error (null in this case) and a user (also null in this case)
                // this will result in the server returning a 401 status code
                done(null, null);
              }
        
    } catch (error) {
        console.log('Error with query for user ', error);
        // done takes an error (we have one) and a user (null in this case)
        // this will result in the server returning a 500 status code
        done(error, null);
    }
   
  })
);

module.exports = passport;