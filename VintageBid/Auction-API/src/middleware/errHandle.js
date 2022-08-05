const errHandle = (error, req, res, next) => {
  const { err } = req
  console.log('this is last middle ware', req.err)
  res.json({
    status: false,
    message: err
  })
}

module.exports = errHandle