const AccountModel = require('../../models/account')

const getOne = (req, res, next) => {
  const { userInfo } = req
  const { userId } = req.params

  AccountModel.findOne({
    _id: userId
  })
    .then(resData => {
      if(resData) {
        let official = false
  
        if (userId === userInfo._id) {
          official = true
        }
        res.json({
          status: true,
          official: official,
          userData: resData
        })
      } else {
        req.err = 'Không tìm thấy user'
        next('last')
      }
    })
    .catch(err => {
      req.err = 'loi profile'
      next('last')
    })
}

module.exports = getOne