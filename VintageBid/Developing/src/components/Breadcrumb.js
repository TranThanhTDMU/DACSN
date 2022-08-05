import { Link } from 'react-router-dom'
const Breadcrumb = ({ category, item }) => {
  return (
    <div id='breadcrumb'>
      <div className='container'>
        <div className='breadcrumb-container'>
          <Link className='home' to='/'>
            <i className="fas fa-home"></i>
            <span>
              Trang chủ
            </span>
          </Link>
          <Link style={{ marginRight: 12 }} to='/'>
            <i className="fas fa-angle-right"></i>
            <span>
              {category || 'Đang cập nhật'}
            </span>
          </Link>
          {
            item &&
            <a to='#'>
              <i className="fas fa-angle-right"></i>
              <span>
                {item || 'Đang cập nhật'}
              </span>
            </a>
          }
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb