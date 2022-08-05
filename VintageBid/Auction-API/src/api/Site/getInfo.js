const SiteModel = require('../../models/siteInfor')

const getInfo = (req, res, next) => {
  SiteModel.find({})
    .then(data => {
      res.json({
        status: true,
        site: data
      })
    })
    .catch(err => {
      req.err = 'Loi lay thong tin trang'
      next('last')
    })
}

module.exports = getInfo