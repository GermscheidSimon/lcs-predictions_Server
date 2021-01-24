const express = require('express');
const router = express.Router()

const axios = require('axios')


router.get('/fetchSchedules', (req, res) => {
    try {

        axios({
            method: 'GET',
            url: 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US&leagueId=98767991299243165',
            headers: {
                "x-api-key": `${process.env.API_KEY}`
            }
        })

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;