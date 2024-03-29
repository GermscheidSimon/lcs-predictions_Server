const {MongoClient, ObjectId} = require('mongodb')
const _mongoURL = process.env.MONGO_CONNECTION
const client = new MongoClient(_mongoURL)

const getUserByIDwPWD = (id) => {
    try {
        client.connect()
        const user = client.db(process.env.DB_NAME).collection("users").find({_id: ObjectId(id)})
        return user
    } catch (error){
        console.log(error)
    } finally {
        client.close()
    }
}

const getUserByID = (id) => {
    try {
        client.connect()
        const user = client.db(process.env.DB_NAME).collection("users").find({_id: ObjectId(id)})
        delete user.password
        return user
    } catch (error){
        console.log(error)
    } finally {
        client.close()
    }
}

const dataAccess = {
    client: client,
    getUser: getUserByID,
    getUser_Auth: getUserByIDwPWD
}
module.exports = dataAccess
