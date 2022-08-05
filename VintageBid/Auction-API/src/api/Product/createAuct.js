const AccountModel = require('../../models/account')
const ProductModel = require('../../models/product')

const createAuct = (data) => {
  const { productId, user } = data
  return ProductModel.updateOne({
    _id: productId
  },
    { 
      minPrice: data.price,
      $push: {
        playingList: { ...user, price: data.price, time: Date.now() }
      }
    }
  )
}

module.exports = createAuct