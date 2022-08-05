const CategoryModel = require('../../models/category')

const getAllCategory = (req, res, next) => {
  CategoryModel.find({})
    .then(resData => {
      if (resData && resData.length > 0) {
        res.json({
          status: true,
          category: resData
        })
      } else {
        req.err = 'can not find category'
        next('last')
      }
    })
}

module.exports = getAllCategory