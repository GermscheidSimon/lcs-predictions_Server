const express = require('express');
const router = express.Router()

const axios = require('axios')


router.get('/fetchSchedules', async (req, res) => {

    console.log('schedule fetch');
    try {

       const schedule = await axios({
            method: 'GET',
            url: 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US&leagueId=98767991299243165',
            headers: {
                "x-api-key": `${process.env.API_KEY}`
            }
        });
        console.log(schedule.data);
        res.send(schedule.data);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;