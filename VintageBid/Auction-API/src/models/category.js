const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = new Schema({
  name: { type: String, maxLength: 256 },
  slug: { type: String },
})

module.exports = mongoose.model('category', Category)