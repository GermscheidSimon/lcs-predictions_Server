const axios = require('axios')

let haveFectchedLCS = false
let data = {
    lcs: {}
}


const getData =  async (league) => {
    if(league == "LCS" && !haveFectchedLCS) {
        try {

            const schedule = await axios({
                 method: 'GET',
                 url: 'https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US&leagueId=98767991299243165',
                 headers: {
                     "x-api-key": `${process.env.API_KEY}`
                 }
             });
             data.lcs =  schedule.data
             haveFectchedLCS = true
             return data.lcs

        } catch (error) {
             console.log(error);
        }
    } else {
        return data.lcs
    }
}
module.exports = fetchScheduleData = {
    getData: getData
}