const express = require('express')
const router = express.Router()
const getInfo = require('../api/Site/getInfo')


router.get('/', getInfo)

module.exports = router