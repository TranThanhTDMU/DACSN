const express = require('express')
const router = express.Router()
const login = require('../api/Sign/login')
const tesst = require('../api/Sign/tesst')

router.post('/', login)
router.post('/tesst',tesst)

module.exports = router