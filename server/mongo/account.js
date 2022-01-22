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

module.exports = {
    getAccountByID: getAccountByID
}

