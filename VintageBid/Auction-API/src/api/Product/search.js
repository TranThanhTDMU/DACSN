const ProductModel = require('../../models/product')

const search = (req, res, next) => {
  ProductModel.find({})
    .populate('category')
    .populate('seller', 'firstName lastName _id image role')
    .then(data => {
      if (data && data.length > 0) {
        let afterFilter = data

        const { slug } = req.params
        if(slug && slug.trim() === '') {
          return res.json({
            status: false
          })
        }
        
        const query = slug.split('-')

        const lib = afterFilter.map(item => ({
          words: item.slug.split('-'),
          data: {
            ...item._doc
          }
        }))

        const result = lib.map(item => {
          const weight = item.words.reduce((time, word) => {
            query.forEach(item2 => {
              if (item2 === word)
                time++
            })
            return time
          }, 0)

          if (weight > 0) {
            return {
              ...item.data,
              weight
            }
          }
        }).filter(x => x).sort((a, b) => b.weight - a.weight)

        res.json({
          status: true,
          products: result
        })
      }
    })

    .catch(err => {
      return res.send(err)
    })
}

module.exports = search