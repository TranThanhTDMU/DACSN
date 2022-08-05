const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Trademark = new Schema({
  name: { type: String, minLength: 1},
  slug: { type: String, minLength: 1}
})

module.exports = mongoose.model('trademark', Trademark)