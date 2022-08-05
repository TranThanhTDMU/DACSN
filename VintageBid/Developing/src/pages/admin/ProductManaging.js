import ProductList from '../../components/productList'
import ManageFilter from '../../components/ManageFilter'
import BreadCrumb from '../../components/Breadcrumb'
import { useState, useEffect, useContext } from 'react'
import api from '../../utils/axios'
import { DataContext } from '../../store'
import { toggleLoading } from '../../store/actions'

const ProductManager = () => {
  const { state, dispatch } = useContext(DataContext)

  const [products, setProducts] = useState([])
  const [checkPassed, setCheckPassed] = useState(true)

  useEffect(() => {
    dispatch(toggleLoading(true))
    api('GET', 'api/auth/admin')
      .then(res => {
        if (res.data && res.data.status) {
          api('GET', `api/products`)
            .then(productRes => {
              if (productRes.data && productRes.data.status) {
                setProducts(productRes.data.products)
                dispatch(toggleLoading(false))
              } else {
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
      <BreadCrumb category='Quản lý sản phẩm' />
      <div id='admin-product'>
        <div className='container'>
          <ManageFilter checkPassed={checkPassed} setCheckPassed={setCheckPassed} />
          <ProductList checkPassed={checkPassed} setProducts={setProducts} products={products} isAdmin={true} />
        </div>
      </div>
    </>
  )
}

export default ProductManager