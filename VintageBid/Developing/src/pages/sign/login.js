import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { usernameValidate } from '../../utils/validate'
import { getUser, toggleLoading } from '../../store/actions'
import { DataContext } from '../../store/index'
import api from '../../utils/axios'
import Cookies from 'js-cookie'
import { GoogleLogin } from 'react-google-login';

const SignIn = (props) => {

  const { state, dispatch } = useContext(DataContext)
  const [usernameErr, logUsernameErr] = useState(false)
  const [userData, setUserData] = useState({})
  const [passCheck, setPassCheck] = useState(false)
  const [login, setLogin] = useState(false)
  const history = useHistory()

  useEffect(() => {
    localStorage.clear()
    Cookies.remove('userToken')
  }, [])

  const usernameValidation = (e) => {
    let value = e.target.value
    value = value.trim()
    setUserData({
      ...userData,
      username: value
    })

    if (value !== '') {
      logUsernameErr(!usernameValidate(value))
      if (checkValidate(!usernameValidate(value), passCheck) && value?.length > 0 && userData.password?.length >= 6) {
        setLogin(true)
      } else {
        setLogin(false)
      }
    } else {
      logUsernameErr(false)
    }
  }

  const passValidation = (e) => {
    let value = e.target.value
    value = value.trim()

    setUserData({
      ...userData,
      password: value
    })

    if (value.length < 5) {
      setPassCheck(true)
    } else {
      setPassCheck(false)
    }

    if (checkValidate(usernameErr, passCheck) && userData.username?.length > 0 && value?.length >= 6) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }


  const checkValidate = (usernameErr, passCheck) => {
    if (!usernameErr && !passCheck) {
      return true
    } else return false
  }

  const responseGoogle = async (response) => {
    try {
      dispatch(toggleLoading(true))
        const res = await axios.post('/api/login/tesst',{tokenId:response.tokenId})

          if (res.data && res.data.status) {
            const { user } = res.data
            localStorage.setItem('login', true)
            localStorage.setItem('id', user._id)
            localStorage.setItem('image', user.image)
            localStorage.setItem('email', user.email)
            localStorage.setItem('firstName', user.firstName)
            localStorage.setItem('lastName', user.lastName)
            localStorage.setItem('phone', user.phone)
            localStorage.setItem('role', user.role)
            Cookies.set('userToken', res.data.token, { expires: 7 })
            dispatch(toggleLoading(false))
            dispatch(getUser())
            history.replace({ pathname: '/' })
          } else {
            alert('Thông tin tài khoản không đúng, vui lòng đăng nhập lại.')
          }
    } catch (error) {
        console.log(error.response.data)
    }
    
}

  const submitHandle = (e) => {
    if (checkValidate(usernameErr, passCheck)) {
      dispatch(toggleLoading(true))
      api('POST', '/api/login', userData)
        .then(res => {
          if (res.data && res.data.status) {
            const { user } = res.data
            localStorage.setItem('login', true)
            localStorage.setItem('id', user._id)
            localStorage.setItem('image', user.image)
            localStorage.setItem('email', user.email)
            localStorage.setItem('firstName', user.firstName)
            localStorage.setItem('lastName', user.lastName)
            localStorage.setItem('phone', user.phone)
            localStorage.setItem('role', user.role)
            Cookies.set('userToken', res.data.token, { expires: 7 })
            dispatch(toggleLoading(false))
            dispatch(getUser())
            history.replace({ pathname: '/' })
          } else {
            alert('Thông tin tài khoản không đúng, vui lòng đăng nhập lại.')
          }
        })
        .catch(err => {
          console.log('err', err)
        })
        .then(() => {
          dispatch(toggleLoading(false))
        })
    } else {
      alert('Thông tin không hợp lệ!')
    }
    e.preventDefault()
  }

  return (
    <>
    <div className="black">
      <div className='sign-in-container'>
        <div className='sign-in-header'>
          <div className='sign-in-logo-wrapper'>
            <Link to='/'>
              <img src='/images/mb_logo.png' />
            </Link>
          </div>
          <h1 className='sign-in-title'>Welcome!</h1>
        </div>
        <form onSubmit={(e) => submitHandle(e)} id='sign-up-form'>
          <label htmlFor='username'>Username: </label>
          <input onChange={(e) => usernameValidation(e)} className={usernameErr ? 'validate-error' : ''} required id='username' placeholder='Enter your Username' name='username' />
          <label htmlFor='password'>Password: </label>
          <input onChange={(e) => passValidation(e)} required type='password' placeholder='******' id='password' name='password' />
          <Link className='link-to-sign-in' to='/forget'>
            Forgot password?
                    </Link>
          <div className='form-btn'>
            <button disabled={!login} type='submit' className={login ? 'sign-btn active' : 'sign-btn'}>
              Sign in
                        </button>
          </div>
          <div className='form-auths'>
            <Link to='/' className='fb'>
              <span>Facebook</span><i className="fab fa-facebook"></i>
            </Link>
            <GoogleLogin
                    clientId="925372749044-6foob3s5elcv3invl18q8lo19d7h8cuj.apps.googleusercontent.com"
                    onSuccess={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                >
                    <span> Login with Google</span>
            </GoogleLogin>
          </div>
        </form>
        <Link to='/register' className='link-to-sign-in'>
          Chưa có tài khoản? Đăng ký ngay!
                </Link>
      </div>
    </div>
    </>
  )
}

export default SignIn