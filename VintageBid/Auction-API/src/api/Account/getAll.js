const AccountModel = require('../../models/account')

const getAll = (req, res, next) => {
  const { userRole } = req
  if(userRole === 'admin') {
    AccountModel.find({})
      .then(data => {
        if (data && data.length > 0) {
          res.json({
            status: true,
            users: data
          })
        }
      })
      .catch(err => {
        req.err = 'Loi lay tat ca user'
        return next('last')
      })
  } else {
    req.err = 'khong co quyen'
    return next('last')
  }
}

module.exports = getAll