const express = require('express');
const router = express.Router()
const dataAccess = require('../modules/dataAccess.js')


router.get('/getUsers',  (req, res) => {
    console.log('user fetch');
    try {
       const users = dataAccess.users
        res.send(users);
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;

