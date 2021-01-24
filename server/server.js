const express = require('express')
require('dotenv').config();
const app = express()
const PORT = 5000 || process.env.PORT

const schedule = require('./routes/schedule.router')
app.use('/api/schedule', schedule)


app.listen(PORT, () => {
    console.log(`server running on port', ${PORT}`);
})