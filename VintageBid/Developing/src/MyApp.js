import MainLayout from './layouts'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { DataContext } from './store'
import { useContext, useEffect } from 'react'
import { getUser } from './store/actions'

import './static/css/reset.css'
import './static/css/header.scss'
import './static/css/footer.scss'
import './static/css/product.scss'
import './static/css/sign.scss'
import './static/css/home.scss'
import './static/css/create.scss'
import './static/css/main.scss'
import './static/css/admin.scss'
import './static/css/profile.scss'
import './static/css/responsive.scss'

import Product from './pages/product'
import SignIn from './pages/sign/login'
import SignUp from './pages/sign/register'
import Create from './pages/create'
import Update from './pages/update'
import ProductManager from './pages/admin/ProductManaging'
import UserManager from './pages/admin/UserManaging.js'
import Profile from './pages/profile'
import UserProduct from './pages/profile/UserProducts'
import Search from './pages/search'
import Home from './pages/home'
import Loading from './components/Loading'

const MyApp = () => {
  const { state, dispatch } = useContext(DataContext)
  console.log('By _mb1o4er')
  useEffect(() => {
    dispatch(getUser())
  }, [])

  return (
    <>
      {
        state.loading &&
        <Loading />
      }
      <Router>
        <Switch>
          <Route path='/login'>
            <SignIn />
          </Route>
          <Route path='/register'>
            <SignUp />
          </Route>
          <Route path='/products/create'>
            <Create />
          </Route>
          <Route path='/profile/:userId/products'>
            <MainLayout>
              <UserProduct />
            </MainLayout>
          </Route>
          <Route path='/profile/:userId'>
            <Profile />
          </Route>
          <Route path='/products/update/:productId'>
            <Update />
          </Route>
          <Route path='/products/v1/search'>
            <MainLayout>
              <Search />
            </MainLayout>
          </Route>
          <Route path='/admin/products'>
            <MainLayout>
              <ProductManager />
            </MainLayout>
          </Route>
          <Route path='/admin/users'>
            <MainLayout>
              <UserManager />
            </MainLayout>
          </Route>
          <Route path='/products/:slug'>
            <MainLayout>
              <Product />
            </MainLayout>
          </Route>
          <Route path='/'>
            <MainLayout>
              <Home />
            </MainLayout>
          </Route>
        </Switch>
      </Router>
    </>
  )
}

export default MyApp