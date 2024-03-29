const authService = require('./auth.service')
const logger = require('../../services/logger.service')
const session = require('express-session')
const userService = require('../user/user.service')


async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await authService.login(email, password)
        req.session.user = user;
        res.json(user)
        console.log('logged in:', user.email);
    } catch (err) {
        res.status(401).send({ Error: err })
    }
}

async function signup(req, res) {
    try {
        const { email, password, username } = req.body
        logger.debug(email + ", " + username + ', ' + password)
        const account = await authService.signup(email, password, username)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(email, password)
        req.session.user = user
        
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}


async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out!' })
        console.log('logged out!');
    } catch (err) {
        res.status(500).send({ error: err })
    }
}

module.exports = {
    login,
    signup,
    logout,
}