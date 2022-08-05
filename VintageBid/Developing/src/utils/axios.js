import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3999'
axios.defaults.withCredentials = true

// axios.defaults.baseURL = 'https://chilindo-fake.herokuapp.com'

const api = (method, url, data) => {
  let userToken
  userToken = localStorage.getItem('userToken') || null
  axios.defaults.headers.common = { 'Authorization': `bearer ${userToken}` }
  
  if (method && url) {
    return axios({
      method,
      url,
      data: data || {},
    })
  } else {
    console.log('error somt')
  }
}

export default api