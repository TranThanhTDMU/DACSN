const AccountModel = require('../../models/account')
const fs = require('fs')

const editAvt = (req, res, next) => {
  const file = req.files?.file
  const { userInfo } = req
  const data = req.body || {}
  let path

  if (!file) {
    path = 'user_default.jpg'
  } else {
    path = `${file.name}`
    file.mv(`${__dirname}../../../../public/upload/${path}`)
  }

  AccountModel.updateOne({
    _id: userInfo._id
  }, {
    image: path
  })
    .then(resData => {
      if (resData) {
        if (data.oldFile && data.oldFile !== path && data.oldFile !== 'default_image.png' && data.oldFile !== 'user_default.jpg') {
          try {
            fs.unlinkSync(`${__dirname}../../../../public/upload/${data.oldFile}`)
          } catch (err) {
            req.err = 'Error_28/editAvt'
            next('last')
          }
        }
        res.json({
          status: true,
          newImage: path
        })
      }
    })
}

module.exports = editAvt