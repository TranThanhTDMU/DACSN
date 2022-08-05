const getPage = (page, size) => {
  page < 0 ? page = 1 : page = page
  page = parseInt(page)
  let skip = (page - 1) * size
  let limit = size

  return {
    skip,
    limit
  }
}

module.exports = getPage