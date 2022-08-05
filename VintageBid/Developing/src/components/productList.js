import { Link } from 'react-router-dom'
import { useContext } from 'react'
import getImage from '../utils/getImage'
import api from '../utils/axios'
import { DataContext } from '../store/index'
import HomeCounter from './homeCounter'

const ProductList = (props) => {
  const { state, dispatch } = useContext(DataContext)

  const { products, checkPassed, setProducts, search, isSeller, isAdmin } = props

  const passProduct = (item, index) => {
    const productId = item._id
    const sellerId = item.seller._id
    api('GET', `api/products/pass/${productId}`)
      .then(res => {
        if (res.data && res.data.status) {
          const newProducts = [
            ...products.slice(0, index),
            {
              ...item,
              passed: true
            },
            ...products.slice(index + 1)
          ]
          setProducts(newProducts)

          state.socket.emit('pass product', { name: item.name, sellerId })
        } else {
          alert('Lỗi duyệt sản phẩm')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteProduct = (productId, seller) => {
    const sellerId = seller._id
    api('POST', `api/products/delete/${productId}`, { sellerId })
      .then(res => {
        if (res.data && res.data.status) {
          const newProducts = products.filter(x => x._id !== productId)
          setProducts(newProducts)
        } else {
          alert('Lỗi xóa sản phẩm')
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <div id='product-list'>
      <div className='container'>
        <div className='productList-container'>
          <div className='row'>
            {
              products && products.length > 0 && products.map((item, index) => {
                if (item.passed === !checkPassed)
                  return (
                    <div key={item._id} className='col col-sm-12 col-md-6 col-lg-3 col-xl-3'>
                      <div className='checkPassed'>
                        {
                          !item.passed &&
                          <button onClick={() => passProduct(item, index)} className='pass-btn pass'>Duyệt</button>
                        }
                        {
                          !search && (isSeller || isAdmin) &&
                          <button onClick={() => deleteProduct(item._id, item.seller)} className='pass-btn delete'>Xóa</button>
                        }
                        {
                          !search && isSeller && !isAdmin &&
                          <Link to={`/products/update/${item._id}`} style={{ width: '50%', textAlign: 'center', display: 'inline-block' }} className='pass-btn pass'>Sửa</Link>
                        }
                      </div>
                      <div className='item'>
                        <div className='item-container'>
                          <div className='thumb'>
                            <Link to={`/products/${item.slug || ''}`}>
                              <img src={getImage(item.image)} alt='' />
                            </Link>
                          </div>
                          <div className='info'>
                            <Link to={`/products/${item.slug || ''}`}>{item.name}</Link>
                            <i className='producer'>#{item.category && item.category.name || 'Đang cập nhật...'}</i>
                            <p>{item.producer || 'Đang cập nhật...'}</p>
                            {
                              !item.sold &&
                              <div className='auct-info'>
                                <HomeCounter time={item.time} />
                                <div className='min-price'>
                                  <Link to={`/products/${item.slug || ''}`}>
                                    <i className="fas fa-gavel"></i>
                                    <span>{item.minPrice || 0}đ</span>
                                  </Link>
                                </div>
                              </div>
                              ||
                              <p style={{ color: 'rgb(253, 56, 56)', fontFamily: 'fontRegular', marginLeft: 12 }}>Đã bán</p>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              })
              ||
              <p style={{ width: '100%' }} className='alert alert-warning'>
                Không có sản phẩm nào!
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList