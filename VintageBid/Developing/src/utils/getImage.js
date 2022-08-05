export default (path) => {
  if (path && path !== 'null')
    return `http://localhost:3999/upload/${path}`
  else
    return '/images/default_img.jpg'
}