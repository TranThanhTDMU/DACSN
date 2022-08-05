const checkAdmin = (req, res, next) => {
  const { userRole } = req

  if(userRole === 'admin') {
    res.json({
      status: true
    })
  } else {
    req.err = 'not permiss'
    next('last')
  }
}

module.exports = checkAdmin