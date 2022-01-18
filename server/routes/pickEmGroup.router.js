const express = require('express');
const router = express.Router()
const dataAccess = require('../modules/dataAccess.js')
const {ObjectId} = require('mongodb');


router.get('/getMyGroups',  async(req, res) => {

    try {
        let groups = []
        await dataAccess.connect()
        const db = dataAccess.db(process.env.DB_NAME)
        const userContext =  await db.collection("users").find({_id: ObjectId(req.user._id)})
        const groupIDs = userContext.pickEmGroups
        for (const groupID of groupIDs) {
            const groupObj = await db.collection("pickEmGroups").find({
                _id: ObjectId(groupID)
            })
            groups.push(groupObj)
        }
        res.send(groups);
    } catch (error) {
        console.log(error);
    } finally {
        await dataAccess.close()
    }
})


module.exports = router;

