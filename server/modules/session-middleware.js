
const cookieSession = require('cookie-session');

// `application` ->  `storage` -> `cookies` section of the chrome debugger


const serverSessionSecret = () => {
  if (!process.env.SERVER_SESSION_SECRET ||
      process.env.SERVER_SESSION_SECRET.length < 8 ) {
  }

  return process.env.SERVER_SESSION_SECRET;
};

module.exports = cookieSession({
  secret: serverSessionSecret(), 
  key: 'user',
  resave: false,
  saveUninitialized: false,
  maxAge: 60 * 60 * 1000, // Set to 1 hour - 60 min/hour * 60 s/min * 1000 ms/s
  secure: false,
});