import UserList from '../../components/UserList'
import { useState, useEffect, useContext } from 'react'
import api from '../../utils/axios'
import { DataContext } from '../../store'
import { toggleLoading } from '../../store/actions'
import Breadcrumb from '../../components/Breadcrumb'

const UserManager = () => {
  const [users, setUsers] = useState([])
  const { state, dispatch } = useContext(DataContext)

  useEffect(() => {
    dispatch(toggleLoading(true))
    api('GET', 'api/auth/admin')
      .then(res => {
        if (res.data && res.data.status) {
          api('GET', `api/users`)
            .then(userRes => {
              if (userRes.data && userRes.data.status) {
                setUsers(userRes.data.users)
                dispatch(toggleLoading(false))
              }
            })
        } else {
          alert('Bạn không có quyền truy cập trang này!')
        }
      })
  }, [])

  return (
    <>
    <Breadcrumb category='Quản lý người dùng' />
    <div id='admin-product' className='container'>
      <UserList users={users} setUsers={setUsers} />
    </div>
    </>
  )
}

export default UserManager