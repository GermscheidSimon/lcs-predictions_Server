const express = require('express');
const router = express.Router()
const pickEmGroups = require('../mongo/pickEmGroups')
const account = require('../mongo/account')
const axios = require('axios')
const user  = require('../mongo/users')
const joinCodeGen = require('../modules/joinCodeGen')
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');



router.get('/getMyGroups', async(req, res) => {
    try {
        console.log(req.user, 'getgroupsbyuser')
        console.log(req.isAuthenticated())
        const accountObj = await account.getAccountByID(req.user._id) // get groups user is a part of
        const groups = accountObj.pickEmGroups
        const groupInformation = await pickEmGroups.getGroups(groups) // get groups
        res.send(groupInformation)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post('/createNewGroup',  async(req, res) => {
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
            },
            groupName: "ABC Group Name"
        }
        */
        const newCode = await joinCodeGen.createNewUniqueCode()
        const league = req.body.league.id
        const tourn = req.body.tourn
        const tournEvents = []
        const eventWeeks = {}
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
        console.log(req.body)

        for (const match of tournEvents) {
            const weekNotInDictforGivenMatch = eventWeeks[match.blockName] === undefined
            if(weekNotInDictforGivenMatch) {
                eventWeeks[match.blockName] = {
                    week: match.blockName,
                    start: match.startTime, 
                    matches: []
                }
                eventWeeks[match.blockName].matches.push(match.match)
            } else {
                eventWeeks[match.blockName].endDate = match.startTime,
                eventWeeks[match.blockName].matches.push(match.match)
            }
        }

        const newGroup = {
            name: req.body.groupName.replace(/[^a-zA-Z0-9]/g, ''),
            league: req.body.league,
            tourn: req.body.tourn,
            events: tournEvents,
            isActive: true,
            joinCode: newCode,
            members: [
                {
                    username: req.user.username,
                    id: req.user._id
                }
            ], 
            eventWeeks: eventWeeks
        }


        const create = await pickEmGroups.createNewGroup(newGroup)
        const groupAddedToUser = await account.addGroupToUser(req.user._id, create.insertedId)

        if(create.acknowledged && groupAddedToUser){
            res.sendStatus(201)
        } else {
            res.sendStatus(500)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.put('/addUserToGroup', async ( req, res ) => {
    try{
        const userIsAdded = await pickEmGroups.addUserToGroup(
                    req.body.groupID,
                    req.body.joinCode,
                    req.user._id,
                    req.user.username
                )
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

router.get('/getGroup/:id', async (req, res) =>{
    try {
        const group = await pickEmGroups.getGroupByID(req.user._id, req.params.id)
        if(group !== "AuthError"){
            res.send(group)
        } else {
            res.sendStatus(401)
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})
router.post('/prediction', async (req, res) =>{
    try {
        const groupCur = await pickEmGroups.addPrediction(req.body)
        if (groupCur.acknowledged){
            res.sendStatus(201)
        } else {
            res.sendStatus(500)
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

router.put('/joinGroup', async (req, res) =>{
    try {
      console.log(req.body.code)
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

module.exports = router;

