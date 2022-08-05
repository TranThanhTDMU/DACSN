const mongoose = require('mongoose')

const connect = async () => {
  try {
    await mongoose.connect('mongodb+srv://Tranthanh:thanh12345@cluster0.v2jh0.mongodb.net/daugia?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    console.log('connect db successfully!')
  } catch(error) {
    console.log(error)
    console.log('connect db failed!')
  }
}

module.exports = { connect }