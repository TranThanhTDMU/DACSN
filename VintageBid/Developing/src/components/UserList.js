import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import api from '../utils/axios'
import getImage from '../utils/getImage'
import toSlug from '../utils/toSlug'
const UserList = (props) => {
  const { users, setUsers } = props
  const searchRef = useRef(null)

  const blockUser = (user, index) => {
    const userId = user._id
    api('POST', `api/users/block/${userId}`)
      .then(res => {
        if (res.data && res.data.status) {
          const newUserList = [
            ...users.slice(0, index),
            {
              ...user,
              block: !user.block
            },
            ...users.slice(index + 1),
          ]

          setUsers(newUserList)
        }
      })
  }

  const unBlockUser = (user, index) => {
    const userId = user._id
    api('POST', `api/users/block/${userId}`, { unBlock: true })
      .then(res => {
        if (res.data && res.data.status) {
          const newUserList = [
            ...users.slice(0, index),
            {
              ...user,
              block: !user.block
            },
            ...users.slice(index + 1),
          ]

          setUsers(newUserList)
        }
      })
  }

  const searchUser = (e) => {
    e.preventDefault()
    const query = searchRef.current.value
    if(query && query.length > 0) {
      const slug = toSlug(query)
      api('GET', `api/users/${slug}`)
      .then(res => {
        if (res.data && res.data.status) {
          setUsers(res.data.users)
        } else {
          alert('Error')
        }
      })
    }
  }


  return (
    <div id='admin-user'>
      <div className='user-search'>
        <form onSubmit={searchUser}>
          <div className='input-wrapper'>
            <input ref={searchRef} name='user' placeholder='Tìm kiếm user' />
            <button type='submit'>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
      </div>
      {
        users && users.length > 1 &&
        <ul>
          <p className='alert alert-success'>All users:</p>
          {
            users.map((item, index) => {
              if (item.role !== 'admin') {
                return (
                  <li key={item._id}>
                    <div className='user-item'>
                      <div className='user-container'>
                        <div className='avt-wrapper'>
                          <Link to={`/profile/${item._id}`}>
                            <img src={getImage(item.image)} alt='' />
                          </Link>
                        </div>
                        <div className='user-info'>
                          <Link to={`/profile/${item._id}`}>
                            <span>{`${item.firstName} ${item.lastName}`}</span>
                          </Link>
                        </div>
                      </div>
                      {
                        item.block &&
                        <div className='user-tool'>
                          <button onClick={() => unBlockUser(item, index)}>Bỏ Chặn</button>
                        </div>
                        ||
                        <div className='user-tool'>
                          <button onClick={() => blockUser(item, index)}>Chặn</button>
                        </div>
                      }
                    </div>
                  </li>
                )
              }
            })
          }
        </ul>
        ||
        <p className='alert alert-warning'>Chưa có users.</p>
      }
    </div>
  )
}

export default UserList