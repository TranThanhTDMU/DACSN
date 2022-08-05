const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const getUser = require('../../utils/getUser')
const { changeInfo, changeAvt } = require('../controllers/MeController')

router.get('/', auth, controller.index)
router.post('/', auth, getUser, changeInfo)
router.post('/avt', auth, getUser, changeAvt)

module.exports = router