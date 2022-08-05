const AccountModel = require('../../models/account')

const notify = (notif, userId) => {
  return AccountModel.updateOne({
    _id: userId
  }, {
    $push: {
      notif: { value: notif }
    }
  })
}

module.exports = notify