const pickEmgroup = require('../mongo/pickEmGroups')
const joinCodeGen = {
    newCode: Math.random().toString(36).slice(2),
    createNewUniqueCode: async () =>{
        const groups = await pickEmgroup.getAll()
        const newCodeObj = getNewcheckCode(groups)
        if (newCodeObj.isunique){
            return newCodeObj.code
        } else {
            getNewcheckCode(groups)
        }
    }
}
const getNewcheckCode = (groups) => {
    const newCode = Math.random().toString(36).slice(2)
    let unique = true
    groups.forEach(element => {
        if(element.joinCode === newCode) {
          unique = false
        }
    })
    return {
        isunique: unique,
        code: newCode
    }
}
module.exports = joinCodeGen