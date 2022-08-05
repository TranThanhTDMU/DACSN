const CategoryModel = require('../../models/category')
const fs = require('fs')
const toSlug = require('../../utils/toSlug')
const mongoose = require('mongoose')

const preHandle = (req, res, next) => {
  //get file
  const file = req.files?.image || null
  const data = req.body || {}

  const { userInfo } = req

  if (data.author) {
      if (userInfo.id !== data.author._id) {
          req.err = 'not permissed'
          return next('last')
      }
  }

  let path

  if (!file) {
      path = null
      req._path = path
  } else {
      path = file.name
      req._path = path
      file.mv(`${__dirname}../../../../public/upload/${path}`, err => {
          console.log(`${__dirname}../../../../public/upload/${path}`)
          if (err) {
              req.err = 'Lỗi upload'
              return next('last')
          } else {
              req.oldFile = data.oldFile
          }
      })
  }

  const { newCate } = data
  //-// check if user added new category
  if (newCate) {
      const newCateSlug = toSlug(newCate)
      //-//-// check by slug
      CategoryModel.findOne({ slug: newCateSlug })
          .then(resData => {
              if (resData) {
                  req.err = 'category existed'
                  return next('last')
              } else {
                  const myId = mongoose.Types.ObjectId()

                  const newCateModel = {
                      _id: myId,
                      name: newCate,
                      slug: newCateSlug
                  }

                  const newCateIns = new CategoryModel(newCateModel)
                  newCateIns.save((err) => {
                      if (err !== null) {
                          req.err = 'can not create Category'
                          return next('last')
                      } else {
                          req.categoryId = myId
                          next()
                      }
                  })
              }
          })
          .catch(err => {
              req.err = 'loi tim category'
              return next('last')
          })
  } else {
      req.categoryId = data.categoryId
      next()
  }
}

module.exports = preHandle