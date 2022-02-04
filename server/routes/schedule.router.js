const express = require('express');
const router = express.Router()
const fetchScheduleData = require('../modules/fetchScheduleData.js')
const axios = require('axios')
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');



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

router.get('/fetchTournByLeageID/:id', async (req, res) => {
    try {

        const tourn = await axios({
             method: 'GET',
             url: `https://esports-api.lolesports.com/persisted/gw/getTournamentsForLeague?hl=en-US&leagueId=${req.params.id}`,
             headers: {
                 "x-api-key": `${process.env.API_KEY}`
             }
         });
         res.send(tourn.data) 
    } catch (error) {
         console.log(error);
    }
})

router.get('/getstandings/:tournID', async (req, res) => {
    try {
        
        const tourn = await axios({
             method: 'GET',
             url: `https://esports-api.lolesports.com/persisted/gw/getStandings?hl=en-US&tournamentId=${req.params.tournID}`,
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
        
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;

