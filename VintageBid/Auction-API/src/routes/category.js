const express = require('express')
const router = express.Router()

const getAllCategories = require('../api/Category/getAllCategories')

router.get('/', getAllCategories) 

module.exports = router