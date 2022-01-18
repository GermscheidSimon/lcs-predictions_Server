const express = require('express');
const router = express.Router()
const fetchScheduleData = require('../modules/fetchScheduleData.js')


router.get('/fetchSchedules', async (req, res) => {

    console.log('schedule fetch');
    try {

       const schedule = await fetchScheduleData.getData("LCS")
        res.send(schedule);
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;

