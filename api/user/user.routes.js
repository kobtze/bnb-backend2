const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUser, getUsers, deleteUser, addUser, updateUser} = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUser)
// router.put('/:id', updateUser)   // BUGGY
// router.put('/:id',  requireAuth, updateUser)
router.delete('/:id', deleteUser)
// router.delete('/:id',  requireAuth, requireAdmin, deleteUser)

module.exports = router