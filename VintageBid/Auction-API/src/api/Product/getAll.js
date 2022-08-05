const getPage = require('../../utils/getPage')
const ProductModel = require('../../models/product')
const jwt = require('jsonwebtoken')
const PAGE_SIZE = 8

const getAll = (req, res, next) => {
  const { page } = req.query || 1
  const { skip, limit } = getPage(page, PAGE_SIZE)

  const { seller, category, checkSeller, sortDate } = req.query

  const query = {}
  let sort = '-createDate'
  let isSeller = false
  
  if (category) {
      query.category = category
  }
  if (sortDate) {
      sort = sortDate
  }
  if (seller) {
      query.seller = seller
      let token = req.cookies.userToken

      if (token) {
          let result = jwt.verify(token, 'mb1o4er')
          if (result && result._id === seller) {
              isSeller = true
          }
      } else {
          req.err = 'loitoken'
          next('last')
      }

  } else if (seller) {
      query.seller = seller
  }

  ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('seller', 'firstName lastName _id image role')
      .populate('category')
      .then(data => {
          if (data && data.length > 0) {
              ProductModel.countDocuments(query)
                  .then(count => {
                      if (count) {
                          res.json({
                              status: true,
                              products: data,
                              isSeller,
                              page: parseInt(page),
                              totalPage: Math.ceil(count / PAGE_SIZE),
                              totalProduct: count
                          })
                      } else {
                          req.err = 'loi dem post'
                          next('last')
                      }
                  })
          } else {
              req.err = 'khong tim thay'
              next('last')
          }
      })
      .catch(err => {
          req.err = err
          next('last')
      })
}

module.exports = getAll