import Filter from './filter'
import ProductList from './ProductList'
import { useState, useEffect, useContext } from 'react'
import { DataContext } from '../../store/index'
import { toggleLoading } from '../../store/actions'
import api from '../../utils/axios'

const Home = () => {

  const { state, dispatch } = useContext(DataContext)

  const [products, setProducts] = useState([])
  const [totalProduct, setTotalProduct] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [currentCate, setCurrentCate] = useState(null)
  const [currentDate, setCurrentDate] = useState(null)


  useEffect(() => {
    dispatch(toggleLoading(true))
    api('GET', `/api/products?page=${1}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data && res.data.products && res.data.products.length > 0) {
            const newProducts = res.data.products.filter(x => x.passed)
            setProducts(newProducts)
            setCurrentPage(res.data.page)
            setTotalPage(res.data.totalPage)
            setTotalProduct(res.data.totalProduct)
          }
        }
      })
      .catch(err => console.log(err))
      .then(() => {
        dispatch(toggleLoading(false))
      })
  }, [])

  const filter = (query) => {
    const { category, date } = query
    setCurrentCate(category)
    setCurrentDate(date)

    let url = '/api/products?'

    if (category) {
      url = url + `category=${category}&`
    }

    if (date) {
      url = url + `sortDate=${date}&`
    }

    dispatch(toggleLoading(true))

    api('GET', `${url}page=${1}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data && res.data.products && res.data.products.length > 0) {
            setProducts(res.data.products)
            setCurrentPage(res.data.page)
            setTotalPage(res.data.totalPage)
            setTotalProduct(res.data.totalProduct)
          } else {
            setProducts([])
            setTotalProduct(0)
          }
        }
      })
      .catch(err => console.log(err))
      .then(() => {
        dispatch(toggleLoading(false))
      })
  }

  const removeProducts = (postId) => {
    const newList = products.filter(x => x._id !== postId)
    setProducts(newList)
  }

  return (
    <>
      <div id='home'>
        <div className='container'>
          <div className='home-container'>
            <div className='home-banner'>
              <img src='/images/fakebanner.png' />
            </div>
            <Filter totalFilter={filter} length={products.length} total={totalProduct} />
            {
              products && products.length > 0 &&
              <>
                <ProductList removeEl={removeProducts} setProducts={setProducts} products={products} />
              </>
              ||
              <p style={{marginTop: 32}} className='alert alert-warning'>
                Không có sản phẩm nào!
              </p>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Home