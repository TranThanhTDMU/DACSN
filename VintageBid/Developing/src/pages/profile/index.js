import { useEffect, useState, useRef, useContext } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import api from '../../utils/axios'
import getImage from '../../utils/getImage'
import Cookies from 'js-cookie'
import getUserInfo from '../../utils/getUserInfo'
import { DataContext } from '../../store'
import { toggleLoading } from '../../store/actions'

const Profile = (props) => {
  const { state, dispatch } = useContext(DataContext)

  const { userId } = useParams()
  const currentUser = getUserInfo()
  const history = useHistory()

  const firstNameEl = useRef(null)
  const lastNameEl = useRef(null)
  const emailEl = useRef(null)
  const phoneEl = useRef(null)
  const oldPassEl = useRef(null)
  const newPassEl = useRef(null)
  const confirmPassEl = useRef(null)

  const [user, setUser] = useState({})
  const [changeForm, setChangeForm] = useState(false)
  const [data, getData] = useState({ name: '', path: '' })
  const [file, setFile] = useState(null)
  const [oldPassErr, setOldPassErr] = useState(false)
  const [newPassErr, setNewPassErr] = useState(false)
  const [confirmPassErr, setConfirmPassErr] = useState(false)
  const [changingPass, setChangingPass] = useState(false)
  const [origin, setOrigin] = useState(false)

  const handleOldPass = (e) => {
    let value = e.target.value
    value = value.trim()
    if (value.length < 6) {
      setOldPassErr(true)
    } else {
      setOldPassErr(false)
    }

    if (value === '') {
      setOldPassErr(false)
    }
  }

  const handleNewPass = (e) => {
    let value = e.target.value
    value = value.trim()
    if (value.length < 6) {
      setNewPassErr(true)
    } else {
      setNewPassErr(false)
    }

    if (value === '') {
      setNewPassErr(false)
    }

  }

  const closeChangePass = () => {
    oldPassEl.current.value = null
    newPassEl.current.value = null

    setChangingPass(false)
  }

  const handleConfirmPass = (e) => {
    let value = e.target.value
    value = value.trim()

    if (value !== newPassEl.current.value) {
      setConfirmPassErr(true)
    } else {
      setConfirmPassErr(false)
    }

    if (value === '') {
      setConfirmPassErr(false)
    }

  }

  const handleSubmit = () => {
    const firstName = firstNameEl.current.value && firstNameEl.current.value.length > 0 && firstNameEl.current.value || user.firstName
    const lastName = lastNameEl.current.value && lastNameEl.current.value.length > 0 && lastNameEl.current.value || user.lastName
    const phone = phoneEl.current.value && phoneEl.current.value.length > 0 && phoneEl.current.value || user.phone
    const email = emailEl.current.value && emailEl.current.value.length > 0 && emailEl.current.value || user.email
    const oldPass = oldPassEl.current.value && oldPassEl.current.value.length > 5 && oldPassEl.current.value || null
    const newPass = newPassEl.current.value && newPassEl.current.value.length > 5 && newPassEl.current.value || null

    const data = {
      file,
      firstName,
      lastName,
      phone,
      email,
      newPass,
      oldPass
    }

    if (!oldPassErr && !newPassErr && !confirmPassErr) {
      api('POST', `api/profile/${userId}`, data)
        .then(res => {
          if (res.data && res.data.status) {
            const { newInfo } = res.data
            localStorage.setItem('firstName', newInfo.firstName)
            localStorage.setItem('lastName', newInfo.lastName)
            const { newToken } = res.data

            if (newToken && newToken.length > 0) {
              Cookies.set('userToken', newToken)
            }

            setChangeForm(false)
            window.location.reload()
          } else {
            alert('Lỗi thay đổi thông tin')
          }
        })
    }
  }

  const changeAvt = () => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('oldFile', user.image)
    dispatch(toggleLoading(true))

    api('POST', `api/profile/avt/${userId}`, formData)
      .then(res => {
        if (res.data && res.data.status) {
          dispatch(toggleLoading(false))
          localStorage.setItem('image', res.data.newImage)
          window.location.reload()
        }
      })

  }

  const handleAvtChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onloadend = (e) => {
      const url = reader.result
      getData({ name: 'manh', path: url })
    }

    if (selectedFile && selectedFile.type.match('image.*')) {
      reader.readAsDataURL(selectedFile)
    }
  }

  useEffect(() => {
    dispatch(toggleLoading(true))

    api('GET', `api/profile/${userId}`)
      .then(res => {
        if (res.data && res.data.status) {
          setUser(res.data.userData)
          setOrigin(res.data.official)

          dispatch(toggleLoading(false))
        } else {
          alert('Lỗi lấy thông tin cá nhân')
          dispatch(toggleLoading(false))
        }
      })

  }, [])

  return (
    <div className='profile'>
      {
        origin &&
        <div className='edit-form' hidden={!changeForm}>
          <button onClick={() => setChangeForm(false)} className='back-btn'>
            <i className="fas fa-times"></i>
          </button>
          <div className='edit-form-container'>
            <h3>Edit your profile</h3>
            <div className='edit-form-input'>
              <input ref={firstNameEl} placeholder={user && user.firstName} />
              <input ref={lastNameEl} placeholder={user && user.lastName} />
              <input ref={phoneEl} placeholder={user && user.phone} />
              <input ref={emailEl} placeholder={user && user.email} />
            </div>
            <div className='password-form'>
              <p onClick={() => setChangingPass(true)}>Change Password</p>
              <div className='change-pass-container' hidden={!changingPass}>
                <i onClick={closeChangePass} className="fas fa-times-circle"></i>
                <input onChange={handleOldPass} ref={oldPassEl} type='password' style={{ borderColor: oldPassErr && 'rgb(231, 100, 100)' }} placeholder='current password'></input>
                <input onChange={handleNewPass} ref={newPassEl} type='password' style={{ borderColor: newPassErr && 'rgb(231, 100, 100)' }} placeholder='new password'></input>
                <input onChange={handleConfirmPass} ref={confirmPassEl} type='password' style={{ borderColor: confirmPassErr && 'rgb(231, 100, 100)' }} placeholder='confirm password'></input>
              </div>
            </div>
            <button disabled={!(!oldPassErr && !newPassErr && !confirmPassErr)} style={{ cursor: !(!oldPassErr && !newPassErr && !confirmPassErr) && 'no-drop' || 'pointer' }} onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      }
      <div className='profile-container'>
        <div className='profile-header-container'>
          <div className='profile-header'>
            <Link to='/'>
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1>Profile</h1>
          </div>
        </div>
        <div className='profile-body'>
          <div className='body-user-info'>
            <div className='avt-wrapper'>
              <img src={file ? data.path : getImage(user && user.image)} />
              {
                origin &&
                <label htmlFor='change-avt' className='change-avt'>
                  <i className="fas fa-camera"></i>
                  <input id='change-avt' onChange={handleAvtChange} type='file' placeholder='avatar' />
                </label>
              }
            </div>
            <div className='user-bio'>
              {
                file &&
                <button onClick={changeAvt} className='change-avt-btn'>Save</button>
              }
              <p>{`${user && user && user.firstName} ${user && user && user.lastName}`}</p>
              <div className='phone-number'>
                <a style={{ color: 'green' }} href={`tel:${user && user.phone}`}>Call: {user && user.phone}</a>
              </div>
              <div className='email'>
                <p style={{ fontFamily: 'fontLight' }}>Email: {user && user.email}</p>
              </div>
              <div className='post-data'>
                <a href={`/profile/${userId}/products`}>Products</a>
              </div>
            </div>
            {
              origin &&
              <div className='option'>
                <button className='setting' onClick={() => setChangeForm(true)}>
                  <i className="fas fa-user-edit"></i>
                </button>
                <Link to='/login' className='close-btn'>
                  <i className="fas fa-power-off"></i>
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

  )
}

export default Profile