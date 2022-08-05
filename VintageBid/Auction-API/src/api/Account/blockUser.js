const AccountModel = require('../../models/account')

const blockUser = (req, res, next) => {
  const { userId } = req.params
  const { userRole } = req
  const { unBlock } = req.body

  if (userRole === 'admin') {
    let block
    if(unBlock) block = false
    if(!unBlock) block = true
    AccountModel.updateOne({
      _id: userId
    }, {
      block
    })
      .then(resData => {
        if (resData) {
          res.json({
            status: true,
          })
        } else {
          req.err = 'Khong the block'
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

module.exports = blockUser