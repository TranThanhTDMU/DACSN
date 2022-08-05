import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb'
import DetailCounter from '../../components/detailCounter'
import { useState, useEffect, useContext } from 'react'
import api from '../../utils/axios'
import getImage from '../../utils/getImage'
import date from '../../utils/getDate'
import { DataContext } from '../../store/index'
import { toggleLoading } from '../../store/actions'
import getUserInfo from '../../utils/getUserInfo'

const Product = () => {
  const { state, dispatch } = useContext(DataContext)
  const { slug } = useParams()

  const [price, setPrice] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [product, setProduct] = useState({})
  const [playingList, setPlayingList] = useState([])

  useEffect(() => {

    state.socket.on('receive auction', (data) => {
      const { user } = data
      const newPlayingList = [
        {
          firstName: user.firstName,
          lastName: user.lastName,
          price: data.price,
          time: Date.now()
        },
        ...data.currentList
      ]
      setMinPrice(data.price)
      setPlayingList(newPlayingList)

    })

    dispatch(toggleLoading(true))
    api('GET', `api/products/${slug}`)
      .then(res => {
        if (res.data && res.data.status) {
          if (res.data.product.passed) {
            setProduct(res.data.product)
            setPlayingList(res.data.product.playingList.reverse())
            setMinPrice(res.data.product.minPrice)
            state.socket.on('get product notify', data => {
              const { userInfo, price, newProduct } = data
              if (res.data.product._id === newProduct._id) {
                setProduct({
                  ...newProduct,
                  sold: true,
                  winner: userInfo.id,
                  seller: res.data.product.seller,
                  price
                })
              }
            })
          } else {
            return alert('Sản phẩm chưa được duyệt')
          }
        } else {
          return ('Lỗi lấy thông tin sản phẩm')
        }
      })
      .catch(err => {
        console.log(err)
        alert('Lỗi lấy thông tin sản phẩm.')
      })
      .then(() => {
        dispatch(toggleLoading(false))
      })

  }, [])

  const handleChange = (e) => {
    let value = e.target.value
    if (value > product.minPrice) {
      setPrice(value)
    }
  }

  const handleBlur = (e) => {
    let value = e.target.value
    if (value < product.minPrice) {
      e.target.value = minPrice
    }
  }

  const createAuction = () => {
    if (state && state.login) {
      const future = new Date(product.time)
      const now = new Date()
      var count = (future - now) / 1000
      count = parseInt(count)
      if (count > 0) {
        if (product.quickPrice > 0 && price >= product.quickPrice) {
          return getProduct(product)
        } else if (price > minPrice) {
          const user = getUserInfo()
          const data = {
            productId: product._id,
            user,
            price: price,
            playingList,
          }
          state.socket.emit('create auction', data)
        } else {
          alert('Giá không hợp lệ!')
        }
      } else {
        alert('Hết hạn đấu giá')
      }
    } else {
      alert('Bạn chưa đăng nhập')
    }

  }

  const getProduct = (product, user) => {
    const userInfo = user || state.user
    if(state && !state.login) return alert('Bạn chưa đăng nhập')
    if ((userInfo.id || userInfo._id) !== product.seller._id) {
      state.socket.emit('get product', { product, userInfo })
    }
  }

  return (
    <>
      <Breadcrumb category='Sản phẩm' item={product && product.name || 'Đang cập nhật...'} />
      <div id='product'>
        <div className='container'>
          <div className='detail-container'>
            <div className='show'>
              <div className='image-wrapper'>
                <div className='main-image'>
                  <img src={getImage(product.image)} />
                </div>
              </div>
              <div className='main-info'>
                <h1>{product.name}</h1>
                <div className='cate-container'>
                  <span className='category'> {product.category && product.category.name || 'Đang cập nhật'}</span>
                  <span className='producer'> #{product.producer || 'Đang cập nhật'}</span>
                  <div className='seller'>
                    <i className="fas fa-user"></i>
                    <Link to={`/profile/${product.seller && product.seller._id}`}> {product.seller && `${product.seller.firstName} ${product.seller.lastName}` || 'Đang cập nhật'}</Link>
                  </div>
                </div>
                {
                  !product.sold &&
                  <>
                    <DetailCounter product={product} setProduct={setProduct} time={product.time} />
                    <div className='win'>
                      <div className='price'>
                        <span>Giá thầu hiện tại</span>
                        <h6>{minPrice}đ</h6>
                        {
                          (state.user && state.user.id) !== (product.seller && product.seller._id) &&
                          <div className='auction'>
                            <label htmlFor='product_auct'>Trả giá: </label>
                            <input key={minPrice} onChange={handleChange} onBlur={handleBlur} type='number' id='product_auct' defaultValue={minPrice} step={product.priceStep || 1000} min={minPrice} max={product.quickPrice > 0 && product.quickPrice} ></input>
                            <button onClick={createAuction}>Xác nhận</button>
                          </div>

                        }
                        <div className='winner'>
                          {
                            playingList && playingList.length > 0
                            &&
                            <div className='won-winner'>
                              <div>
                                <span>Dẫn đầu:</span>
                                <i className="fas fa-trophy"></i>
                                <Link to='' className='user-name'>{`${playingList[0].firstName} ${playingList[0].lastName}`}</Link>
                              </div>
                            </div>
                          }

                        </div>
                      </div>
                      {
                        parseInt(product.quickPrice) > 0 &&
                        <div className='quick-buy' onClick={() => getProduct(product)}>
                          <span>Mua trực tiếp
                          <i className="fas fa-shopping-cart"></i>
                          </span>
                          <h4>
                            {product.quickPrice}đ
                          </h4>
                        </div>
                      }
                    </div>
                  </>
                  ||
                  <>
                    <h1 className='done'>
                      <i class="fas fa-calendar-check"></i>
                    Đấu giá đã kết thúc.
                  </h1>
                    <h1 className='done'>
                      Sản phẩm đã được bán với giá {product.price}đ
                    </h1>
                    {
                      (state.user && state.user.id) === (product.seller && product.seller._id) &&
                      <Link style={{ fontSize: '1.4rem', color: 'green' }} to={`/profile/${product.winner}`}>
                        <i class="fas fa-phone-volume"></i>
                        <span style={{ marginLeft: 12 }}>
                          Liên hệ người mua
                        </span>
                      </Link>
                    }
                  </>
                }
              </div>
            </div>
            <div className='detail-info'>
              {
                !product.sold &&
                <div>
                  {
                    playingList && playingList.length > 0 &&
                    <div className='player-list scroll'>
                      <ul>
                        <li className='title'>
                          <div className='row title-container'>
                            <div className='player-name col-6'>
                              <span>
                                Tên
                        </span>
                            </div>
                            <div className='player-price col-2'>
                              <span>
                                Giá
                        </span>
                            </div>
                            <div className='player-quantity col-1'>
                              <span>
                                Số lượng
                        </span>
                            </div>
                            <div style={{ fontSize: '1rem' }} className='player-time col-3'>
                              <span>
                                Thời gian
                        </span>
                            </div>
                          </div>
                        </li>
                        {
                          playingList.map(item =>
                            <li>
                              <div className='row title-container'>
                                <div className='player-name col-6'>
                                  <Link to=''>
                                    {`${item.firstName} ${item.lastName}`}
                                  </Link>
                                </div>
                                <div className='player-price col-2'>
                                  <span>
                                    {item.price}
                                  </span>
                                </div>
                                <div className='player-quantity col-1'>
                                  <span>
                                    1
                            </span>
                                </div>
                                <div className='player-time col-3'>
                                  <span>
                                    {date(item.time)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          )
                        }
                      </ul>
                      <span className='see-more'>Xem nhiều hơn</span>
                    </div>
                    ||
                    <p className='alert alert-warning'>Chưa có người tham gia đấu giá!</p>
                  }
                </div>
              }
              <div className='description'>
                <div className='detail'>
                  <span>Mã sản phẩm: {product._id}</span>
                </div>
                <div className='discribe'>
                  <p style={{ fontFamily: 'fontRegular', fontStyle: 'italic' }}>Mô tả sản phẩm:</p>
                  <div dangerouslySetInnerHTML={{ __html: product.content || 'Đang cập nhật...' }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product