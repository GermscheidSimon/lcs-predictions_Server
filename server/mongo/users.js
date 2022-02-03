const {MongoClient, ObjectId} = require('mongodb')

const getUserByIDwPWD = async (id) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({_id: ObjectId(id)})
        await client.close()
        return user
    } catch (error){
        console.log(error)
    } 
}
const getUserByUsernamewPWD = async (username) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({username: username}).toArray()
        await client.close()
        return user[0]
    } catch (error){
        console.log(error)
    }
}
const getUserByUsername = async (username) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({username: username}).toArray()
        await delete userObj.password

        await client.close()
        return user[0]
    } catch (error){
        console.log(error)
    }
}

const getUserByID = async (id) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        const user = await client.db(process.env.DB_NAME).collection("users").find({_id: new ObjectId(id)}).toArray()
        const userObj = user[0]
        userObj._id = await userObj._id.toString()
        await delete userObj.password
        await client.close()
        return userObj
    } catch (error){
        console.log(error)
    }
}

const putNewUSer = async (username, password) => {
    const _mongoURL = process.env.MONGO_CONNECTION
    const client = new MongoClient(_mongoURL)

    try {
        await client.connect()
        await client.db(process.env.DB_NAME).collection("users").insertOne({username: username, password: password})
        const user = await client.db(process.env.DB_NAME).collection("users").find({username: username}).toArray()
        const userObj = user[0]
        userObj._id = await userObj._id.toString()
        await delete userObj.password
        await client.close()
        return userObj
    } catch (error){
        console.log(error)
    }
}





module.exports = {
    getUser: getUserByID,
    getUser_Auth: getUserByIDwPWD,
    getUserByUsername: getUserByUsernamewPWD,
    getUserByUsernameWOP: getUserByUsername,
    putNewUSer: putNewUSer,
}
