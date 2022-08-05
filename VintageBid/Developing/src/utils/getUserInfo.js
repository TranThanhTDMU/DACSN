const getUserInfo = () => {
  const login = localStorage.getItem('login')
  const id = localStorage.getItem('id')
  const role = localStorage.getItem('role')
  const firstName = localStorage.getItem('firstName')
  const lastName = localStorage.getItem('lastName')
  const image = localStorage.getItem('image')

  return {
    login, id, firstName, lastName, role, image
  }
}

export default getUserInfo