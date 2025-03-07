import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Login/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import RequireAuth from './components/RequireAuth'
import Users from './pages/User/Users'
import UserProfile from './pages/User/User'
import NotFound from './pages/NotFound/NotFound'
import Categories from './pages/Category/Categories'
import Vendors from './pages/Vendor/Vendors'
import Vendor from './pages/Vendor/Vendor'
import Brands from './pages/Brand/Brands'
import Brand from './pages/Brand/Brand'
import Products from './pages/Product/Products'
import ProductDetails from './pages/Product/Product'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]} />}>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/brands' element={<Brands />} />
            <Route path='/brands/:id' element={<Brand />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products/:id' element={<ProductDetails />} />
            <Route path='/vendors' element={<Vendors />} />
            <Route path='/vendors/:id' element={<Vendor />} />
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id' element={<UserProfile />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
