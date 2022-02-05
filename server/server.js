const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./modules/userStrategy');
const PORT = process.env.PORT || 5000
const schedule = require('./routes/schedule.router')
const pickEmGroup = require('./routes/pickEmGroup.router')
const users = require('./routes/user.router')
var cookieSession = require('cookie-session')


const cors = require('cors')
const app = express()
app.set('trust proxy', 1) // trust first proxy

const corsOptions = {
    origin: 'https://pro-lague-client.herokuapp.com',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  }
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
         res.send(200);
     } else {
         next();
     }
    });

// app.disable("X-Powered-By");
// app.set("trust proxy", 1); 


app.use(cookieSession({ 
    key: 'user',
    secret:  process.env.SERVER_SESSION_SECRET,
    maxAge: 60 * 60 * 1000, // Set to 1 hour - 60 min/hour * 60 s/min * 1000 ms/s
    secure: false,
    httpOnly: false
}));
// Passport Session Configuration //
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/schedule', schedule)
app.use('/api/pickEmGroup', pickEmGroup)
app.use('/api/user', users)



app.listen(PORT, () => {
    console.log(`server running on port', ${PORT}`);
})