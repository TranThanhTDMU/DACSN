const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const checkAuth = require('../api/Auth/auth')
const checkAdmin = require('../api/Auth/authAdmin')

router.get('/', auth, checkAuth )
router.get('/admin', auth, checkAdmin )

module.exports = router