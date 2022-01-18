const {MongoClient, ObjectId} = require('mongodb')
const _mongoURL = process.env.MONGO_CONNECTION
const client = new MongoClient(_mongoURL)

const getGroups = (groupIDs) => {
    try {
        let groups = []
        await dataAccess.connect()
        const db = dataAccess.db(process.env.DB_NAME)
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
}

module.exports = {
    getGroups: getGroups
}

