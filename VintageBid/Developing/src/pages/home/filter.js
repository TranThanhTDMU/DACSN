import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../../utils/axios'

const FilterSelector = (props) => {
  const [category, setCategory] = useState(null)
  const [currentFilter, setCurrentFilter] = useState([])
  const [currentFilterCate, setCurrentFilterCate] = useState(null)
  const [currentFilterDate, setCurrentFilterDate] = useState(null)
  const [filterActive, setFilterActive] = useState(
    {
      all: true,
      categories: false,
      sort: false
    }
  )

  const filterByCategory = (categoryId, categoryName) => {
    const newList = currentFilter.filter(x => x.type !== 'category')

    setFilterActive({
      ...filterActive,
      categories: true,
      all: false
    })

    setCurrentFilter([
      ...newList,
      {
        type: 'category',
        value: categoryName
      }
    ])

    setCurrentFilterCate(categoryId)

    const query = {
      category: categoryId,
      date: currentFilterDate
    }

    props.totalFilter(query)
  }

  const filterByCreateDate = (type, sortName) => {
    const newList = currentFilter.filter(x => x.type !== 'sort')

    setFilterActive({
      ...filterActive,
      sort: true,
      all: false
    })

    setCurrentFilter([
      ...newList,
      {
        type: 'sort',
        value: sortName
      }
    ])

    setCurrentFilterDate(type)

    const query = {
      category: currentFilterCate,
      date: type
    }

    props.totalFilter(query)
  }

  const filterAll = () => {
    setFilterActive({
      ...filterActive,
      all: true,
      categories: false,
      sort: false
    })
    setCurrentFilter([])
    props.totalFilter({})
  }

  const removeTag = (type) => {
    const newList = currentFilter.filter(x => x.type !== type)
    setCurrentFilter(newList)

    if (type === 'category') {
      setFilterActive({
        ...filterActive,
        categories: false,
      })
    } else if (type === 'sort') {
      setFilterActive({
        ...filterActive,
        sort: false,
      })
    }

    const query = {
      category: currentFilterCate,
      date: currentFilterDate
    }

    if (type === 'category') {
      query.category = null
      setCurrentFilterCate(null)
    } else if (type === 'sort') {
      query.date = null
      setCurrentFilterDate(null)
    }

    if(newList.length === 0) {
      setFilterActive({
        categories: false,
        sort: false,
        all: true
      })
    } 

    props.totalFilter(query)
  }

  useEffect(() => {
    api('GET', 'api/categories')
      .then(res => {
        if (res.data && res.data.status) {
          setCategory(res.data.category)
        }
      })
  }, [])

  return (
    <>
      <div id='filter'>
        <div className='filter-container'>
          <i className="fas fa-filter"></i>
          <ul className='filter-list'>
            <li className={filterActive.all ? 'filter-item active' : 'filter-item'} onClick={filterAll}>Tất cả</li>
            <li className={filterActive.categories ? 'filter-item active' : 'filter-item'}>
              Theo thể loại
              {
                category && category.length > 0 &&
                <ul className='filter-menu'>
                  {
                    category.map(item => (
                      <li onClick={() => filterByCategory(item._id, item.name)}>{item.name}</li>
                    ))
                  }
                </ul>
              }
            </li>
            <li className={filterActive.sort ? 'filter-item active' : 'filter-item'}>Theo ngày
              <ul className='filter-menu'>
                <li onClick={() => filterByCreateDate('-createDate', 'Latest')}>Mới nhất</li>
                <li onClick={() => filterByCreateDate('createDate', 'Earliest')}>Muộn nhất</li>
              </ul>
            </li>
          </ul>
        </div>
        {
          currentFilter && currentFilter.length > 0 &&
          <div className='filter-tag-container'>
            <span>Lọc theo: </span>
            <div className='filter-tags'>
              {
                currentFilter.map(item =>
                  <div className='tag'>
                    <span>
                      {item.value}
                    </span>
                    <i onClick={() => removeTag(item.type)} className="far fa-times-circle"></i>
                  </div>
                )
              }
              <div style={{background: '#f74949af'}} className='tag' onClick={filterAll}>
                <span style={{ cursor: 'pointer' }}>
                  Xóa tất cả bộ lọc
                </span>
              </div>
            </div>
          </div>
        }
      </div>
      {/* <div id='mb-filter'>
        <button>
          <span>Filter</span>
          <i className="fas fa-filter"></i>
        </button>
      </div> */}
      <div className='opt'>
        <div style={{marginTop: 20}} className='all-post'>
          {
            props.length > 0 &&
            <span>{`Hiển thị: ${props.length}/${props.total}`}</span>
          }

          <span className='line'></span>
        </div>
      </div>
    </>
  )

}

export default FilterSelector