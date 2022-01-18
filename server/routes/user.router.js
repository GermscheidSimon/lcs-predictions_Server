const express = require('express');
const router = express.Router()
const userStrategy = require('../modules/userStrategy');
const bcrypt = require('../modules/bcrypt')

const user = require('../mongo/users')
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.post('/logout', (req, res) => {
    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);
});

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = await bcrypt.createPassword(req.body.password);
        await user.putNewUSer(username, password)
    } catch (error) {
        console.log(error)
    } finally {
        res.sendStatus(201)
    }      
  });

  router.get('/', rejectUnauthenticated, (req, res) => {
    // Send back user object from the session (previously queried from the database)
    res.send(req.user);
  });

module.exports = router;

