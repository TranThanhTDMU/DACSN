const express = require('express')
const router = express.Router()
const register = require('../api/Sign/register')

router.post('/', register)


module.exports = router