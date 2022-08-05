
const jwt = require('jsonwebtoken')

const getUser = (req, res, next) => {
  var token = req.cookies.userToken

  if (token) {
    let result = jwt.verify(token, 'mb1o4er')
    if (result) {
      req.userInfo = result
      next()
    } else {
        req.err = 'loi dang nhap'
        next('last')
    }
  }
}

module.exports = getUser