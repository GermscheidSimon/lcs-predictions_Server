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
            await groups.push(...groupArray)
        }
        return groups
    } catch (error) {
        console.log(error);
    }
}
const getAll = async () => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)
    try {
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const groupObjCur = await db.collection("pickEmGroups").find()
        const groupArray = await groupObjCur.toArray()
        return groupArray
    } catch (error) {
        console.log(error);
    }
}


const createNewGroup = async (groupObj) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)
    try {
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const groupObjCur = await db.collection("pickEmGroups").insertOne(groupObj)
        return groupObjCur
    } catch (error) {
        console.log(error);
    }
}

const addUserToGroup = async (groupID, joinCode, userID, username) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)
    try {
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const groupCur = await db.collection("pickEmGroups").find({
            _id: new ObjectId(groupID)
        })
        const group = groupCur.toArray()[0]
        const joinCodeMatches = group.joinCode === joinCode
        
        if(joinCodeMatches){
            const userIsAddedToGroup = await db.collection("pickEmGroups").updateOne(
                {
                _id: new ObjectId(groupID)
                },
                {
                    $addToSet: {
                        members: {
                            username: username,
                            id: userID
                        }
                    }
                }
            )
            return true
        } else{ 
            return false
        }

    } catch (error) {
        console.log(error);
    }
}

const getGroupByID = async (userID, groupID) => {
    try {
        const _mongoURL = process.env.MONGO_CONNECTION
        const client = new MongoClient(_mongoURL)
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        const groupCur = await db.collection("pickEmGroups").find({
            _id: new ObjectId(groupID)
        })
        const group = await groupCur.toArray()
        const groupMembers = group[0].members
        let userIsPartOfGroup = false
        for(const member of groupMembers){
            if(member.id === userID){
                userIsPartOfGroup =true
            }
        }
        if(userIsPartOfGroup){ 
            return group
        } else {
            return 'AuthError'
        }
    } catch (error) {
        console.log(error);
    }
}
const addPrediction = async (newPred) => {

    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)
    await client.connect()
    const db = client.db(process.env.DB_NAME)
    const group = await db.collection("pickEmGroups").find({
        _id: new ObjectId(newPred.groupID)
    })
    const groupArr = await group.toArray()
    const predArry = groupArr[0].predictions
    if(predArry !== undefined && predArry.length > 0) {
        let updated = []
        let onePrediction = {}
        for (const prediction of predArry) {
            if(prediction.username !== newPred.username){
                updated.push(prediction)
            }
            if(prediction.username === newPred.username && newPred.week !== prediction.week){
                updated.push(prediction)
            }
        }
        onePrediction = await db.collection("pickEmGroups").updateOne(
            {
                _id: new ObjectId(newPred.groupID)
            },
            {
                $set: {
                    predictions: [...updated, newPred]
                }
            },
            {
                upsert: true,
            }
        )
    } else {
        onePrediction = await db.collection("pickEmGroups").updateOne(
            {
                _id: new ObjectId(newPred.groupID)
            },
            {
                $set: {
                    predictions: [newPred]
                }
            },
            {
                upsert: true,
            }
        )
    }
    return onePrediction
}

module.exports = {
    getGroups: getGroups,
    getAll: getAll,
    createNewGroup: createNewGroup,
    addUserToGroup: addUserToGroup,
    getGroupByID: getGroupByID,
    addPrediction: addPrediction
}

