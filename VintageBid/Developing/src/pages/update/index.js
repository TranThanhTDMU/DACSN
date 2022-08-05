import TextareaAutosize from 'react-textarea-autosize'
import { useState, useRef, useEffect, useContext } from 'react'
import api from '../../utils/axios'
import toSlug from '../../utils/toSlug'
import { useHistory, Link, useParams } from 'react-router-dom'
import getImage from '../../utils/getImage'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { DataContext } from '../../store'
import { toggleLoading } from '../../store/actions'

const defaultValue = {
  select: 'choose'
}

const Update = () => {
  const { state, dispatch } = useContext(DataContext)

  const history = useHistory()
  const productId = useParams().productId || null

  const [name, setName] = useState(defaultValue.name)
  const [cate, setCate] = useState(defaultValue.category)
  const [minPrice, setMinPrice] = useState(defaultValue.minPrice)
  const [quickPrice, setQuickPrice] = useState(defaultValue.quickPrice)
  const [priceStep, setPriceStep] = useState(1000)
  const [file, setFile] = useState('')
  const [data, getData] = useState({ name: '', path: '/images/default_img.jpg' })
  const [categories, setCategories] = useState([])
  const [select, setSelect] = useState(false)
  const [content, setContent] = useState('')
  const [time, setTime] = useState(null)
  const [producer, setProducer] = useState('')

  const nameEl = useRef(null)
  const cateEl = useRef(null)
  const minPriceEl = useRef(null)
  const quickPriceEl = useRef(null)
  const priceStepEl = useRef(null)
  const producerEl = useRef(null)
  const newCateEl = useRef(null)
  const timeEl = useRef(null)

  const [originData, setOriginData] = useState({})
 
  useEffect(() => {
    dispatch(toggleLoading(true))

    api('GET', '/api/auth')
      .then(res => {
        if (res.data && !res.data.status) {
          setTimeout(() => {
            history.replace({ pathname: '/login' })
          }, 1000)
        }
      })
      .then(() => {
        api('GET', 'api/categories')
          .then(res => {
            if (res.data && res.data.category) {
              setCategories(res.data.category)
            }
          })
      })
      .catch(err => console.log(err))

    api('GET', `api/products/update/${productId}`)
      .then(res => {
        if (res.data && res.data.status) {
          dispatch(toggleLoading(false))

          setOriginData(res.data.product)
          setContent(res.data.product.content)
          cateEl.current.value = JSON.stringify(res.data.product.category)
          setCate(res.data.product.category && res.data.product.category.name || null)
          setName(res.data.product.name)
          setMinPrice(res.data.product.minPrice)
          setQuickPrice(res.data.product.quickPrice)
          setTime(res.data.product.time)
          setProducer(res.data.product.producer)

          getData({
            ...data,
            path: getImage(res.data.product.image)
          })
        }
      })
      .catch(err => console.log(err))

  }, [])

  const handleChange = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    const currentName = nameEl.current.value
    const cateObj = cateEl.current.value
    const newCate = newCateEl.current.value.length > 0 && newCateEl.current.value || null
    const slug = toSlug(currentName)
    const currentCate = cateObj !== defaultValue.select && JSON.parse(cateObj)

    formData.append('name', currentName)
    formData.append('content', content)
    currentCate && formData.append('categoryId', currentCate._id)
    formData.append('image', file || originData.image)
    formData.append('time', timeEl.current.value)
    formData.append('minPrice', minPriceEl.current.value)
    formData.append('quickPrice', quickPriceEl.current.value)
    formData.append('priceStep', priceStepEl.current.value)
    formData.append('producer', producerEl.current.value)
    formData.append('oldFile', originData.image)
    formData.append('seller', originData.seller && originData.seller._id)
    formData.append('slug', slug)
    newCate && formData.append('newCate', newCate)
    
    if (minPriceEl.current.value >= quickPriceEl.current.value) return alert('Giá trần phải lớn hơn giá tối thiểu')

    api('POST', `/api/products/update/${originData._id}`, formData)
      .then(res => {
        if (res.data && res.data.status) {
          history.replace({ pathname: '/' })
        } else {
          alert('Lỗi cập nhật sản phẩm')
        }
      })
      .catch(err => console.log('this is err: ', err))

  }

  const changeName = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.name
    }
    setName(value)
  }

  const changeMinPrice = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.minPrice
    }
    setMinPrice(value)
  }

  const changeQuickPrice = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.quickPrice
    }
    setQuickPrice(value)
  }

  const changePriceStep = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.priceStep
    }
    setPriceStep(value)
  }

  const changeProducer = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.producer
    }
    setProducer(value)
  }

  const changeTime = (e) => {
    let value = e.target.value
    if (value === '') {
      value = originData.time
    }
    setTime(value)
  }

  const createNewCate = (e) => {
    let value = e.target.value
    value = value.trim()
    if (value.length > 0) {
      setSelect(true)
      setCate(value)
    } else {
      if (cateEl.current.value !== defaultValue.select) {
        setCate(JSON.parse(cateEl.current.value).name)
      }
      setSelect(false)
    }
  }

  const changeCate = (e) => {
    let value = e.target.value
    value = JSON.parse(value)

    if (value.name === '') {
      value = originData.category && originData.category.name || 'chua cap nhat'
    }

    setCate(value.name)
  }

  const handlePrice = (e) => {
    const value = e.target.value 
    if(value < 0) {
      e.target.value = 0
    }
  }

  const handleQuickPrice = (e) => {
    const value = e.target.value 
    if(value < 0 || value < minPrice) {
      e.target.value = minPrice
      alert('Vui lòng nhập giá trần cao hơn mức giá tối thiểu')
    }
  }

  return (
    <div className='create-post'>
      <div className='container'>
        <div className='create-container'>
          <Link className='back-to-home' to='/'>
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1> Update your your post</h1>
          <div className='row'>
            <div className='col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8'>
              <div className='create-form'>
                <div className='create-title'>
                  <label htmlFor='create_title'>Tên</label>
                  <input ref={nameEl} defaultValue={name} onChange={(e) => { changeName(e) }} placeholder='ex: How to create React app' id='create_title' />
                  <p>Tên sản phẩm</p>
                </div>
                <div className='create-category'>
                  <label htmlFor='crate-cate-select'>Thể loại:</label>
                  <select disabled={select} onChange={(e) => changeCate(e)} id='create-cate-select' ref={cateEl} name="categories" >
                    {
                      categories && categories.length > 0 &&
                      categories.map(item =>
                        <option key={item._id} selected={item._id === (originData.category && originData.category._id)} value={JSON.stringify(item)}>
                          {item.name}
                        </option>
                      )
                      ||
                      <option defaultValue="" disabled>Thêm mới</option>
                    }
                  </select>
                  <label style={{ marginLeft: 20 }} htmlFor='create-cate-create'>Create New</label>
                  <input ref={newCateEl} onChange={createNewCate} id='create-cate-create' />
                </div>
                <div className='create-producer'>
                  <label htmlFor='create_producer'>Nhãn hiệu</label>
                  <input defaultValue={originData.producer} onChange={changeProducer} ref={producerEl} id='create_producer' />
                  <p>Tên hãng, nhà sản xuất</p>
                </div>
                <div className='create-price'>
                  <label htmlFor='create_price'>Giá sàn</label>
                  <input onBlur={handlePrice} defaultValue={originData.minPrice} onChange={changeMinPrice} ref={minPriceEl} type='number' id='create_price' />
                  <p>Mức giá tối thiểu của sản phẩm</p>
                </div>
                <div className='create-price'>
                  <label htmlFor='create_price'>Bước giá</label>
                  <input onBlur={handlePrice} ref={priceStepEl} onChange={changePriceStep} defaultValue={originData.priceStep} type='number' id='create_price' />
                  <p>Bước giá mỗi lần đấu giá</p>
                </div>
                <div className='create-price'>
                  <label htmlFor='create_price'>Giá trần</label>
                  <input onBlur={handleQuickPrice} defaultValue={originData.quickPrice} min={minPrice} onChange={changeQuickPrice} ref={quickPriceEl} type='number' id='create_price' />
                  <p>Mức giá mua luôn của sản phẩm</p>
                </div>
                <div className='create-time'>
                  <label htmlFor='create_price'>Thời gian</label>
                  <input defaultValue={originData.time} onChange={changeTime} ref={timeEl} type='date' id='create_price' />
                  <p>Thời gian hết hạn đấu giá</p>
                </div>

                <div className='create-img'>
                  <label htmlFor='create_image'>Thumbnail image</label>
                  <input onChange={handleChange} type='file' id='create_image' />
                  <p>The main image of the post</p>
                </div>

                <div className='create-content'>
                  <label htmlFor='create_content'>Content</label>
                  <CKEditor
                    className='about'
                    editor={ClassicEditor}
                    data={content}
                    onReady={editor => {
                      // You can store the "editor" and use when it is needed.
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setContent(data)
                    }}
                    onBlur={(event, editor) => {
                    }}
                    onFocus={(event, editor) => {
                    }}
                  />
                  <p>The Content on the thumb</p>
                </div>
                <button onClick={handleSubmit}>Update</button>
              </div>
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4'>
              <div className='create-demo'>
                <div className='first-container'>
                  <div className='first-thumb'>
                    <img onerror="../images/test/item.jpeg" src={data.path} alt='img' />
                  </div>
                  <div className='first-infor'>
                    <p to='/' className='first-category'>
                      {cate}
                    </p>
                    <span to='/' className='first-title'>
                      {name}
                    </span>
                    <p color='black'>
                      {minPrice}
                    </p>
                    <p color='black'>
                      {quickPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Update