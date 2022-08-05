const AccountModel = require('../../models/account')
const jwt = require('jsonwebtoken')

const editInfo = (req, res, next) => {
  const { userInfo } = req
  const { userId } = req.params

  if (userInfo._id === userId) {
    const data = req.body
    const oldPass = data.oldPass
    const newPass = data.newPass

    const newData = {}
    if(data.firstName && data.firstName.length > 0) {
      newData.firstName = data.firstName
    }
    if(data.lastName && data.lastName.length > 0) {
      newData.lastName = data.lastName
    }
    if(data.phone && data.phone.length > 0) {
      newData.phone = data.phone
    }
    if(data.email && data.email.length > 0) {
      newData.email = data.email
    }

    let newToken
    if (oldPass) {
      if (oldPass.length > 0 && oldPass === userInfo.password) {
        newData.password = newPass
        newToken = jwt.sign({ _id: userInfo._id, username: userInfo.username, password: newPass }, 'mb1o4er') || null
      } else {
        req.err = 'sai mat khau cu'
        next('last')
      }
    }

    AccountModel.updateOne({
      _id: userInfo._id
    }, newData)
      .then(resData => {
        if (resData) {
          res.json({
            status: true,
            newInfo: newData,
            newToken
          })
        } else {
          req.err = 'Khong the thay doi thong tin'
          next('last')
        }
      })
      .catch(err => {
        req.err = 'hollo bug'
        next('last')
      })
  } else {
    req.err = 'not permiss'
    next('last')
  }

}

module.exports = editInfo