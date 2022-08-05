const ProductModel = require('../../models/product')

const filter = (req, res, next) => {
  const { category, sortDate } = req.query

  const query = {}

  if (category) {
    query.category = category
  }
  if (sortDate) {
    query.sort = sortDate
  }

  ProductModel.find(query)
    .populate('category')
    .populate('seller', 'firstName lastName _id image role')
    .then((resData) => {
      if (resData && resData.length > 0) {
        res.json({
          status: true,
          relatedProducts: resData
        })
      } else {
        req.err = 'khong tim thay post'
        next('last')
      }
    })
    .catch(err => {
      req.err = 'dang co loi'
      next('last')
    })
}

module.exports = filter