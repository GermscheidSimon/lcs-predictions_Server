const express = require('express');
const router = express.Router()
const fetchScheduleData = require('../modules/fetchScheduleData.js')
const axios = require('axios')


router.get('/fetchSchedules', async (req, res) => {

    console.log('schedule fetch');
    try {

       const schedule = await fetchScheduleData.getData("LCS")
        res.send(schedule);
    } catch (error) {
        console.log(error);
    }
})

router.get('/fetchLeagues', async (req, res) => {
        try {

            const leagues = await axios({
                 method: 'GET',
                 url: 'https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US',
                 headers: {
                     "x-api-key": `${process.env.API_KEY}`
                 }
             });
             res.send(leagues.data)
        } catch (error) {
             console.log(error);
        }
})

router.get('/fetchTournByLeageID', async (req, res) => {
    try {

        const tourn = await axios({
             method: 'GET',
             url: `https://esports-api.lolesports.com/persisted/gw/getTournamentsForLeague?hl=en-US&leagueId=${req.body.leagueID}`,
             headers: {
                 "x-api-key": `${process.env.API_KEY}`
             }
         });
         res.send(tourn.data) 
    } catch (error) {
         console.log(error);
    }
})

router.post('/buildLeagueTourn', async (req, res) => {
    try {
        /*
        req.body = {
            league: {
                "id": "98767991299243165",
                "slug": "lcs",
                "name": "LCS",
                "region": "NORTH AMERICA",
                "image": "http://static.lolesports.com/leagues/LCSNew-01-FullonDark.png",
                "priority": 1,
                "displayPriority": {
                    "position": 0,
                    "status": "force_selected"
                }
            },
            tourn: {
                "id": "106269680921022418",
                "slug": "lec_2021_summer",
                "startDate": "2021-06-11",
                "endDate": "2021-08-30"
            }
        }
        */
        const league = req.body.league.id
        const tourn = req.body.tourn
        const tournEvents = []
        const leaguescheduleData = await axios({
            method: 'GET',
            url: `https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US&leagueId=${league}`,
            headers: {
                "x-api-key": `${process.env.API_KEY}`
            }
        });
        const schedule = leaguescheduleData.data.data.schedule.events
        for (const event of schedule) {
            const eventStartDateTime = new Date(event.startTime)
            const tournStatDate = new Date(tourn.startDate)
            const tournEndDate = new Date(tourn.endDate)
            const eventIsWithinTournamentStartAndEnd = eventStartDateTime >= tournStatDate && eventStartDateTime <= tournEndDate
            console.log('found event in Tourn', eventIsWithinTournamentStartAndEnd)
            if (eventIsWithinTournamentStartAndEnd) {
                tournEvents.push(event)
            }
        }

        res.send(tournEvents) 
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;

