const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./modules/userStrategy');
const app = express()
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const cors = require('cors')
const PORT = process.env.PORT || 5000
const schedule = require('./routes/schedule.router')
const pickEmGroup = require('./routes/pickEmGroup.router')
const users = require('./routes/user.router')

app.disable("X-Powered-By");
app.set("trust proxy", 1); 

var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
    methods: ['GET', 'PUT', 'POST'],
    exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  }

app.use(cors(corsOptions))


// app.use((req, res, next) => {
//     if(req.headers.origin === 'https://pro-lague-client.herokuapp.com'){
//         console.log('from client')
//     } else{
//         (console.log(req.headers))
//     }
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Headers', );
//     res.header('Access-Control-Allow-Credentials', true)
//     next();
// });



// Passport Session Configuration //

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/schedule', schedule)
app.use('/api/pickEmGroup', pickEmGroup)
app.use('/api/user', users)



app.listen(PORT, () => {
    console.log(`server running on port', ${PORT}`);
})