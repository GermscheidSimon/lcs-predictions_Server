const {MongoClient, ObjectId} = require('mongodb')


const getGroups = async (groupIDs) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)
    try {
        let groups = []
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        for (const groupID of groupIDs) {
            const groupObjCur = await db.collection("pickEmGroups").find({_id: groupID})
            const groupArray = await groupObjCur.toArray()
            await groups.push(groupArray)
        }
        return groups
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getGroups: getGroups
}

