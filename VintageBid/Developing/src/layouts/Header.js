import { Link } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store'
import Notify from '../components/Notify'
import SearchModal from '../components/SearchModal'
import api from '../utils/axios'
import getImage from '../utils/getImage'

const Header = () => {
  const { state, dispatch } = useContext(DataContext)

  const [childMenu, setChildMenu] = useState(false)
  const [manageMenu, setManageMenu] = useState(false)
  const [mbMenu, setMbMenu] = useState(false)
  const [notify, setNotify] = useState(false)
  const [notifyList, setNotifyList] = useState([])
  const [searchModal, setSearchModal] = useState(false)
  const [adminNotif, setAdminNotif] = useState(false)
  const [productNotif, setProductNotif] = useState(false)

  const userId = localStorage.getItem('id')

  useEffect(() => {
    let tempNotifList = []
    api('GET', 'api/users/v/notify')
      .then(res => {
        if (res.data && res.data.status) {
          tempNotifList = res.data.notifyList
          tempNotifList.reverse()
          setNotifyList(res.data.notifyList)
        }
      })
    state.socket.on('pass product notify', data => {
      const { sellerId, name, err } = data
      if (sellerId === userId) {
        const notif = `Sản phẩm ${name} của bạn đã được quản trị viên duyệt.`
        setNotifyList([
          {
            value: notif
          },
          ...tempNotifList,
        ])
      }
    })

    state.socket.on('get product notify', data => {
      const { sellerId, name, err, userInfo } = data

      if (sellerId === userId) {
        const notif = `Sản phẩm ${name} của bạn đã được bán. Hãy liên lạc với người mua để giao dịch`
        setNotifyList([
          {
            value: notif
          },
          ...tempNotifList,
        ])
      }
    })

    state.socket.on('get product notify2', data => {
      const { notif, userInfo } = data
      if (userInfo.id === userId) {
        setNotifyList([
          {
            value: notif
          },
          ...tempNotifList,
        ])
      }
    })

    state.socket.on('user send product', data => {
      const role = localStorage.getItem('role')
      if (role === 'admin') {
        setAdminNotif(true)
        setProductNotif(true)
      }
    })
  }, [])

  return (
    <>
      <SearchModal status={searchModal} setSearchModal={setSearchModal} />
      <div id='header'>
        <div className='container'>
          <div id='desktop'>
            <div className='header-container'>
              <div className='avt-wrapper'>
                <a href='/'>
                  <img src='/images/desktop_logo.png' alt='' />
                </a>
              </div>
              <div className='header-right-wrapper'>
                <div className='search'>
                  <i onClick={() => setSearchModal(true)} style={{ color: 'white', fontSize: '1.1rem', marginRight: 12, cursor: 'pointer' }} className="fas fa-search"></i>
                </div>
                <Link to='/products/create'>
                  <i className="fas fa-gavel"></i>
                  <span>
                    Mở đấu giá
                </span>
                </Link>
                {
                  state.login &&
                  <>
                    {
                      state.user.role !== 'admin' &&
                      <div className='header-notify'>
                        <button onClick={() => setNotify(!notify)} className='notify-btn'>
                          <i className="fas fa-bell"></i>
                          <span>{notifyList.length}</span>
                        </button>
                        {
                          notify &&
                          <Notify notifyList={notifyList} />
                        }
                      </div>
                    }
                    <button onClick={() => setChildMenu(!childMenu)}>
                      <img src={getImage(state.user && state.user.image || null)} />
                      <span>
                        {`${state.user && state.user.firstName} ${state.user && state.user.lastName}`}
                      </span>
                      {
                        childMenu &&
                        <i className="fas fa-sort-up"></i>
                        ||
                        <i className="fas fa-caret-down"></i>
                      }
                      <div className='child-menu' hidden={!childMenu}>
                        <div className='child-menu-container'>
                          <ul>
                            <li>
                              <Link to={`/profile/${userId}`}>
                                <i className="fas fa-user"></i>
                                <span>
                                  Cá nhân
                            </span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/login'>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>
                                  Đăng xuất
                            </span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </button>
                  </>
                  ||
                  <div className='sign-container'>
                    <Link to='/login' className='login-btn'>
                      <i className="fas fa-sign-in-alt"></i>
                      <span>
                        Đăng nhập
                      </span>
                    </Link>
                    <Link style={{ marginLeft: '0px !important' }} to='/register' className='login-btn'>
                      <i class="fas fa-user-plus"></i>
                      <span>
                        Đăng kí
                      </span>
                    </Link>
                  </div>
                }
                {
                  state.login && state.user.role === 'admin' &&
                  <button className='admin-btn' onClick={() => { setManageMenu(!manageMenu); setAdminNotif(false) }} style={{ marginLeft: 16 }}>
                    {
                      adminNotif &&
                      <span className='manage-notif'></span>
                    }
                    <i style={{ marginRight: 8 }} className="fas fa-tasks"></i>
                    <span>
                      Quản lý
                    </span>
                    {
                      manageMenu &&
                      <i className="fas fa-sort-up"></i>
                      ||
                      <i className="fas fa-caret-down"></i>
                    }
                    <div className='child-menu' hidden={!manageMenu}>
                      <div className='child-menu-container'>
                        <ul>
                          <li>
                            <a onClick={() => setProductNotif(false)} className='manage-product' href='/admin/products'>
                              {
                                productNotif &&
                                <span className='manage-notif'></span>
                              }
                              <i className="fas fa-shopping-bag"></i>
                              <span>
                                Sản phẩm
                              </span>
                            </a>
                          </li>
                          <li>
                            <Link to='/admin/users'>
                              <i className="fas fa-users"></i>
                              <span>
                                Người dùng
                            </span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>
          <div id='mobile'>
            <div className='mobile-menu' hidden={!mbMenu}>
              <div className='menu-overlay' onClick={() => setMbMenu(false)}>
              </div>
              <div className='menu-container'>
                <ul>
                  <li>
                    <Link to='/products/create'>
                      <i className="fas fa-gavel"></i>
                      <span>
                        Mở đấu giá
                      </span>
                    </Link>
                  </li>
                  {
                    state.login &&
                    <>
                      <li>
                        <Link to={`/profile/${userId}`}>
                          <i className="fas fa-user"></i>
                          <span>
                            Cá nhân
                      </span>
                        </Link>
                      </li>
                      {
                        state.user.role === 'admin' &&
                        <>
                          <li className='mb-product-manage'>
                            <a onClick={() => setProductNotif(false)} href='/admin/products'>
                              <i className="fas fa-shopping-bag"></i>
                              <span>
                                Quản lý sản phẩm
                              </span>
                              {
                                productNotif &&
                                <span className='manage-notif'></span>
                              }
                            </a>
                          </li>
                          <li>
                            <a href='/admin/users'>
                              <i className="fas fa-users"></i>
                              <span>
                                Quản lý người dùng
                              </span>
                            </a>
                          </li>
                        </>
                      }
                      <li>
                        <Link to='/login'>
                          <i className="fas fa-sign-out-alt"></i>
                          <span>
                            Đăng xuất
                      </span>
                        </Link>
                      </li>
                    </>
                    ||
                    <>
                      <li>
                        <Link to={`/login`}>
                          <i className="fas fa-sign-in-alt"></i>
                          <span>
                            Đăng nhập
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/register`}>
                          <i class="fas fa-user-plus"></i>
                          <span>
                            Đăng kí
                          </span>
                        </Link>
                      </li>
                    </>
                  }
                </ul>
              </div>
            </div>
            <div className='header-container'>
              <div className='avt-wrapper'>
                <a href='/'>
                  <img src='/images/mb_logo.png' alt='' />
                </a>
              </div>
              <div className='btn-wrapper'>
                <button className='mb-search' onClick={() => setSearchModal(true)}>
                  <i className="fas fa-search"></i>
                </button>
                {
                  // state.login && state.user.role === 'admin' &&
                  <button onClick={() => setNotify(!notify)} className='notify-btn'>
                    <i className="fas fa-bell"></i>
                    <span>{notifyList.length}</span>
                    {
                      notify &&
                      <Notify notifyList={notifyList} />
                    }
                  </button>
                }
                <button className='menu-btn' onClick={() => {setMbMenu(true); setAdminNotif(false)}}>
                  <i className="fas fa-bars"></i>
                  {
                    adminNotif &&
                    <span className='manage-notif'></span>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header