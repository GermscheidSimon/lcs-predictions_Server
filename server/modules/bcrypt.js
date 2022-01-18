const bcrypt = require('bcrypt')

const createPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(11)
        const hashedpswd = await bcrypt.hash(password, salt)
        return hashedpswd
    } catch (error) {
        console.log(error);
    }
}

const authenticateUser = async (passReq, pass) => {
    try {
        const result = await bcrypt.compare(passReq, pass)
        return result
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    authenticateUser: authenticateUser,
    createPassword: createPassword
}