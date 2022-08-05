const ProductModel = require('../../models/product')
const CategoryModel = require('../../models/category')
const fs = require('fs')

const update = (req, res, next) => {
  const { userInfo } = req
  const data = req.body || {}
  const { _path, categoryId } = req
  const { productId } = req.params
  
  if (userInfo.id !== data.seller._id) {
      req.err = 'not permissed'
      return next('last')
  }

  const newProduct = {
      name: data.name,
      content: data.content,
      image: _path || data.image,
      slug: data.slug,
      category: categoryId,
      priceStep: data.priceStep,
      minPrice: data.minPrice,
      quickPrice: data.quickPrice,
      producer: data.producer,
      time: data.time,
      source: data.source
  }

  ProductModel.updateOne(
      {
          _id: productId
      },
      newProduct
  )
      .then(resData => {
          if (resData) {
              if(_path && data.oldFile && data.oldFile !== _path && data.oldFile !== 'default_image.png' && data.oldFile !== 'user_default.jpg') {
                  try {
                      fs.unlinkSync(`${__dirname}../../../../public/upload/${data.oldFile}`)
                  } catch (err) {
                      req.err = 'Error_42/update'
                      next('last')
                  }
              }
              res.json({
                  status: true,
                  message: 'cap nhat thanh cong!'
              })
          } else {
              req.err = 'loi server'
              next('last')
          }

      })
      .catch(err => {
          req.err = 'cap nhat that bai'
          next('last')
      })
}

module.exports = update