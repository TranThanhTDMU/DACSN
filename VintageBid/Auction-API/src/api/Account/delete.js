const AccountModel = require('../../models/account')

const deleteUser = (req, res, next) => {
  const { userInfo } = req
  
  if(userInfo.role === 'admin') {
    const { userId } = req.params
    AccountModel.deleteOne({
      _id: userId
    })
      .then(resData => {
        res.json({
          status: true
        })
      })
  } else {
    req.err = 'not permist'
    next('last')
  }

}

module.exports = deleteUser