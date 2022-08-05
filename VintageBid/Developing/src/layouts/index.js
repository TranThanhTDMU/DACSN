import Header from './Header'
import Footer from './Footer'

const MainLayout = (props) => {
  return (
    <div className='app'>
        <Header />
        {props.children}
        <Footer />
    </div>
  )
}

export default MainLayout