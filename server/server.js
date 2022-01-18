const express = require('express')
require('dotenv').config();
const app = express()
const PORT = 5000 || process.env.PORT

const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./modules/userStrategy');

// Passport Session Configuration //
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const schedule = require('./routes/schedule.router')
const pickEmGroup = require('./routes/pickEmGroup.router')
const users = require('./routes/user.router')
app.use('/api/schedule', schedule)
app.use('/api/pickEmGroup', pickEmGroup)
app.use('/api/user', users)



app.listen(PORT, () => {
    console.log(`server running on port', ${PORT}`);
})