const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Account = new Schema({
  username: { type: String, maxLength: 69 },
  password: { type: String, maxLength: 30 },
  email: { type: String, maxLength: 100 },
  firstName: { type: String, maxLength: 30 },
  lastName: { type: String, maxLength: 30 },
  role: { type: String, default: 'user' },
  birthDate: { type: String, default: '17/11/11'},
  image: { type: String, default: 'user_default.jpg'},
  address: { type: String, default: ''},
  phone: { type: String, default: ''},
  playing: { type: Array, default: []},
  won: { type: Array, default: []},
  notif: { type: Array, default: []},
  slug: {type: String, minLength: 1},
  block: { type: Boolean, default: false}
})

module.exports = mongoose.model('account', Account)