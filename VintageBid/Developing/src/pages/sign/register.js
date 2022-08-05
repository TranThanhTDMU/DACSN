import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { nameValidate, usernameValidate, emailValidate, phoneValidate } from '../../utils/validate'
import { DataContext } from '../../store/index'
import { toggleLoading } from '../../store/actions'

import api from '../../utils/axios'

const SignUp = (props) => {
    const { state, dispatch } = useContext(DataContext)

    const [emailErr, logEmailErr] = useState(false)
    const [usernameErr, logUsernameErr] = useState(false)
    const [firstNameErr, logFirstNameErr] = useState(false)
    const [lastNameErr, logLastNameErr] = useState(false)
    const [phoneNumberErr, logPhoneNumberErr] = useState(false)

    const [prePass, setPrePass] = useState('')
    const [passCheck, setPassCheck] = useState(false)

    const [userData, setUserData] = useState({})

    const history = useHistory()

    useEffect(() => {
        localStorage.clear()
    }, [])

    const emailValidation = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            email: value
        })

        if (value !== '') {
            logEmailErr(!emailValidate(value))
        } else {
            logEmailErr(false)
        }
    }

    const phoneNumberValidate = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            phone: value
        })

        if (value !== '') {
            logPhoneNumberErr(!phoneValidate(value))
        } else {
            logPhoneNumberErr(false)
        }
    }

    const usernameValidation = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            username: value
        })

        if (value !== '') {
            logUsernameErr(!usernameValidate(value))
        } else {
            logUsernameErr(false)
        }
    }

    const firstNameValidation = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            firstName: value
        })

        if (value !== '') {
            logFirstNameErr(!nameValidate(value))
        } else {
            logFirstNameErr(false)
        }
    }

    const lastNameValidation = (e) => {
        let value = e.target.value || ''

        setUserData({
            ...userData,
            lastName: value
        })

        if (value !== '') {
            logLastNameErr(!nameValidate(value))
        } else {
            logLastNameErr(false)
        }
    }

    const getPrePass = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setPrePass(value)
    }

    const confirmPass = (e) => {
        let value = e.target.value || ''
        value = value.trim()
        setUserData({
            ...userData,
            password: value
        })

        if (value === '') {
            setPassCheck(false)
        }
        else if (value === prePass && value.length >= 6) {
            setPassCheck(false)
        } else {
            setPassCheck(true)
        }
    }

    const checkValidate = () => {
        if (!emailErr && !usernameErr && !firstNameErr && !lastNameErr && !passCheck) {
            return true
        } else return false
    }

    const submitHandle = (e) => {
        if (checkValidate()) {
            const user = { ...userData }
            dispatch(toggleLoading(true))
            api('POST', '/api/register', user)
                .then(res => {
                    if (res.data && res.data.status) {
                        dispatch(toggleLoading(false))
                        history.replace({ pathname: '/login' })
                    } else {
                        alert('Lỗi đăng kí tài khoản')
                    }
                })
                .catch(err => {
                    console.log(err)
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
                            <img src='/images/mb_logo.png' alt='logo' />
                        </Link>
                    </div>
                    <h1 className='sign-in-title'>Welcome!</h1>
                </div>
                <form onSubmit={(e) => submitHandle(e)} id='sign-in-form'>
                    <span style={{ fontFamily: 'fontLight' }}>Full name:</span>
                    <div className='form-name'>
                        <input onChange={(e) => firstNameValidation(e)} className={firstNameErr ? 'validate-error' : ''} required name='firstName' placeholder='First name' />
                        <input onChange={(e) => lastNameValidation(e)} className={lastNameErr ? 'validate-error' : ''} required name='lastName' placeholder='Last name' />
                    </div>
                    <label htmlFor='email'>Email: </label>
                    <input onChange={(e) => emailValidation(e)} className={emailErr ? 'validate-error' : ''} required id='email' placeholder='example@email.com' name='email' />
                    <label htmlFor='phone'>Phone Number: </label>
                    <input onChange={phoneNumberValidate} className={phoneNumberErr ? 'validate-error' : ''} required id='phone' placeholder='+84...' name='phone' />
                    <label htmlFor='username'>Username: </label>
                    <input onChange={(e) => usernameValidation(e)} className={usernameErr ? 'validate-error' : ''} required id='username' placeholder='username123' name='username' />
                    <label htmlFor='password'>Password: </label>
                    <input onChange={(e) => getPrePass(e)} required type='password' placeholder='a-z, 0-9, at least 6 characters' id='password' name='password' />
                    <label htmlFor='re-password'>Confirm Password: </label>
                    <input onChange={(e) => confirmPass(e)} required className={passCheck ? 'validate-error' : ''} type='password' id='re-password' placeholder='******' name='rePassword' />
                    <div className='form-btn'>
                        <Link to='/sign-in' className='sign-btn'>
                            Sign in
                        </Link>
                        <button className='sign-btn active'>
                            Sign up
                        </button>
                    </div>

                </form>

            </div>
        </div>
        </>
    )
}

export default SignUp