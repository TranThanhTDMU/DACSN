const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});


const middleware = (app) => {
  app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../../public')))
  app.use(fileUpload())
  // app.use(apiLimiter)
}

module.exports = middleware