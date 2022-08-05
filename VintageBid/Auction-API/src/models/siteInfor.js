const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const SiteInfor = new Schema({
  siteName: { type: String, maxLength: 255 },
  description: { type: String, maxLength: 600 },
  contact: { type: Object },
  createDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model('site_infor', SiteInfor)