const {MongoClient, ObjectId} = require('mongodb')
const _mongoURL = process.env.MONGO_CONNECTION
const client = new MongoClient(_mongoURL)

const getUserByIDwPWD = async (id) => {
    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({_id: ObjectId(id)})
        return user
    } catch (error){
        console.log(error)
    } finally {
        await client.close()
    }
}
const getUserByUsernamewPWD = async (username) => {
    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({username: username}).toArray()
        return user[0]
    } catch (error){
        console.log(error)
    } finally {
        await client.close()
    }
}

const getUserByID = async (userObj) => {
    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({_id: new ObjectId(userObj._id)}).toArray()
        delete user[0].password
        return user[0]
    } catch (error){
        console.log(error)
    } finally {
        await client.close()
    }
}

const putNewUSer = async (username, password) => {
    try {
        await client.connect()
        await client.db(process.env.DB_NAME).collection("users").insertOne({username: username, password: password})
    } catch (error){
        console.log(error)
    } finally {
        await client.close()
    }
}


module.exports = {
    client: client,
    getUser: getUserByID,
    getUser_Auth: getUserByIDwPWD,
    getUserByUsername: getUserByUsernamewPWD,
    putNewUSer: putNewUSer
}
