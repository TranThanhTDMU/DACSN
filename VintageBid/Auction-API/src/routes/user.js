const express = require('express')
const router = express.Router()
const search = require('../api/Account/search')
const deleteUser = require('../api/Account/delete')
const getNotify = require('../api/Account/getNotify')
const getAll = require('../api/Account/getAll')
const auth = require('../middleware/auth')
const getUser = require('../utils/getUser')
const blockUser = require('../api/Account/blockUser')


router.get('/:slug', search)
router.get('/v/notify', auth, getUser, getNotify)
router.post('/:userId', auth, getUser, deleteUser)
router.post('/block/:userId', auth, blockUser)
router.get('/', auth, getAll)

module.exports = router