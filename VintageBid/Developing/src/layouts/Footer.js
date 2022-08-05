import { Link } from 'react-router-dom'
const Footer = () => {

  return (
    <div id='footer'>
      <div className='container'>
        <div className='footer-container'>
          <div className='menu1'>
            <h2>Hỗ trợ</h2>
            <ul>
              <li>
                <Link to=''>
                  Liên hệ
                </Link>
              </li>
              
          
            
              
            </ul>
          </div>

          <div className='menu1'>
            <h2>Về chúng tôi</h2>
            <ul>
              <li>
                <Link to=''>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to=''>
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to=''>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to=''>
                  Thông tin công ty
                </Link>
              </li>
            </ul>
          </div>

          <div className='contact'>
            <h2>Connect us</h2>
            <div className='social-networks'>
              <a href=''>
                <i className="fab fa-facebook"></i>
              </a>
              <a href=''>
                <i className="fab fa-google"></i>
              </a>
              <a href=''>
                <i className="fab fa-instagram"></i>
              </a>
              <a href=''>
                <i className="fas fa-phone"></i>
              </a>
            </div>
            <div className='care'>
              <p>Có câu hỏi? Chúng tôi muốn nghe từ bạn!</p>
              <p>Email cho chúng tôi: support@vintagebid.com</p>
            </div>
          </div>
        </div>
        <div className='copyright'>
          <h3>COPYRIGHT @ 2021 VINTAGEBID. ALL RIGHTS RESERVED.</h3>
        </div>
      </div>
    </div >
  )
}

export default Footer