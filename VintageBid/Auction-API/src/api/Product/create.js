const ProductModel = require('../../models/product')
const CategoryModel = require('../../models/category')
const toSlug = require('../../utils/toSlug')
const getPage = require('../../utils/getPage')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const product = require('../../models/product')

const create = (req, res, next) => {
  const data = req.body || {}
  
  const { _path, categoryId, userInfo } = req
  const newProduct = {
      name: data.name,
      content: data.content,
      image: _path,
      time: data.time,
      minPrice: data.minPrice,
      quickPrice: data.quickPrice || 0,
      priceStep: data.priceStep,
      producer: data.producer,
      seller: userInfo._id,
      slug: data.slug,
      category: categoryId,
  }
  if(newProduct.name && newProduct.time && newProduct.minPrice && newProduct.priceStep && newProduct.category ) {
      ProductModel.findOne({ slug: newProduct.slug })
          .then(product => {
              if (product) {
                  req.err = 'Tên sản phẩm đã tồn tại'
                  return next('last')
              } else {
                  const newProductIns = new ProductModel(newProduct)
    
                  newProductIns.save(err => {
                      if (err !== null) {
                          req.err = 'Không thể lưu sản phẩm'
                          return next('last')
                      } else {
                          res.json({
                              status: true,
                              message: 'Tạo sản phẩm thành công'
                          })
                      }
                  })
              }
          })
  } else {
      res.json({
          status: true,
          data: newProduct,
          message: 'Nhập thiếu thông tin'
      })
  }

}

module.exports = create