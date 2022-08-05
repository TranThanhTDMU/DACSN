const jwt = require('jsonwebtoken')
const AccountModel = require('../../models/account')
const toSlug = require('../../utils/toSlug')

const register = (req, res, next) => {
  const data = req.body
  const slug = toSlug(`${data.firstName} ${data.lastName}`)
  data.slug = slug
  
  AccountModel.findOne({ username: data.username })
    .then(resData => {
      if (!resData) {
        const newInstance = new AccountModel(data)
        newInstance.save(err => {
          if (err === null) {
            const { _id, username, password, role, firstName, lastName, email } = newInstance
            const token = jwt.sign({ _id, username, password, role }, 'mb1o4er')
            res.json({
              status: true,
              user: {
                _id,
                username,
                role,
                firstName,
                lastName,
                token
              }
            })
          } else {
            req.err = 'Register Err'
            next('last')
          }
        })
      } else {
        req.err = 'Account exited'
        next('last')
      }
    })
}

module.exports = register