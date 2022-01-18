const bcrypt = require('bcrypt')

const createPassword = async (password) => {
    const salt = await bcrypt.genSalt(11)
    const hashedpswd = await bcrypt.hash(password, salt)
    return hashedpswd
}

const authenticateUser = async (passReq, pass) => {
    const result = await bcrypt.compare(passReq, pass)
    return result
}

module.exports = {
    authenticateUser: authenticateUser,
    createPassword: createPassword
}