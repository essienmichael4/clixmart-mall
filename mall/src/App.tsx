import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import RequireAuth from './components/RequireAuth'
import UserProfile from './pages/User/User'
import NotFound from './pages/NotFound/NotFound'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Search from './pages/Search/Search'
import CategoryProducts from './pages/CateogryProducts/CategoryProducts'
import Cart from './pages/Cart/Cart'
import Product from './pages/Product/Product'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import PasswordReset from './pages/PasswordReset/PasswordReset'
import Wizard from './pages/Wizard/Wizard'
import Orders from './pages/Orders/Orders'
import OrderDetails from './pages/Orders/Order'
import Checkout from './pages/Checkout/Checkout'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/products' element={<Search />} />
        <Route path='/categories/:category' element={<CategoryProducts />} />
        <Route path='/products/:id' element={<Product />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/profile/:id' element={<UserProfile />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/orders/:id' element={<OrderDetails />} />
            <Route path='/wizard' element={<Wizard />} />
            <Route path='/checkout' element={<Checkout />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<PasswordReset />} />
      </Routes>
    </>
  )
}

export default App
