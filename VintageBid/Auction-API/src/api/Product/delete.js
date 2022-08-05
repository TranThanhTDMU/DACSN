const ProductModel = require('../../models/product')
const deleteProduct = (req, res, next) => {
  const { userInfo, userRole } = req
  const { sellerId } = req.body
  const { productId } = req.params

  if (userInfo._id === sellerId || userRole === 'admin') {
      ProductModel.deleteOne({
          _id: productId
      })
          .then(resData => {
              if (resData) {
                  res.json({
                      status: true
                  })
              } else {
                  req.err = 'khong the xoa'
                  next('last')
              }
          })
          .catch(err => {
              req.err = 'loi xoa'
              next('last')
          })
  } else {
      req.err = 'khong the xoa'
      next('last')
  }
}

module.exports = deleteProduct