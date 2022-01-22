const express = require('express');
const router = express.Router()
const pickEmGroups = require('../mongo/pickEmGroups')
const account = require('../mongo/account')

router.get('/getMyGroups',  async(req, res) => {
    try {
        const accountObj = await account.getAccountByID(req.user._id) // get groups user is a part of
        const groups = accountObj.pickEmGroups
        const groupInformation = await pickEmGroups.getGroups(groups) // get groups
        res.send(groupInformation)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router;

