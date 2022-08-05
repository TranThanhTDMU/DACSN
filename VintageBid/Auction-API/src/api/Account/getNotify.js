const { json } = require('express')
const AccountModel = require('../../models/account')

const notify = (req, res, next) => {
  const { userInfo } = req
  AccountModel.findOne({
    _id: userInfo._id
  })
    .then(resData => {
      if(resData) {
        const notifyList = resData.notif
        res.json({
          status: true,
          notifyList: notifyList
        })
      } else {
        req.err = 'err 20'
        next('last')
      }
    })
}

module.exports = notify