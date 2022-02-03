const {MongoClient, ObjectId} = require('mongodb')


const getAccountByID = async (id) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const account = await client.db(process.env.DB_NAME).collection("account").find({id: id}).toArray()
        await client.close()
        return account[0]
    } catch (error){
        console.log(error)
    }
}


const createAccountFromID = async (user) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const account = await client.db(process.env.DB_NAME).collection("account").insertOne({id: user._id, username: user.username, pickEmGroups: []})
        await client.close()
        return account[0]
    } catch (error){
        console.log(error)
    }
}
const addGroupToUser = async (userID, groupID) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const addedGroup = await client.db(process.env.DB_NAME).collection("account").updateOne({
            id: userID,
        },
        {
            $addToSet: {
                pickEmGroups: new ObjectId(groupID)
            }
        }
        )
        console.log(addedGroup)
        await client.close()
        return true
    } catch (error){
        console.log(error)
        return false
    }
}

module.exports = {
    getAccountByID: getAccountByID,
    addGroupToUser: addGroupToUser,
    createAccountFromID: createAccountFromID
}

