const express = require('express')
require('dotenv').config();
const app = express()
const PORT = process.env.PORT || 5000

app.use((req, res, next) => {
    const corsWhitelist = ['http://localhost:3000', 'https://pro-lague-api.herokuapp.com/*', 'https://pro-lague-client.herokuapp.com/*', 'https://localhost:3000/home']
    console.log(req.headers.origin)
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', true)
    }

    next();
});
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./modules/userStrategy');

// Passport Session Configuration //
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const schedule = require('./routes/schedule.router')
const pickEmGroup = require('./routes/pickEmGroup.router')
const users = require('./routes/user.router')
app.use('/api/schedule', schedule)
app.use('/api/pickEmGroup', pickEmGroup)
app.use('/api/user', users)



app.listen(PORT, () => {
    console.log(`server running on port', ${PORT}`);
})