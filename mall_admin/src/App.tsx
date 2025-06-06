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
import Orders from './pages/Order/Orders'
import OrderDetails from './pages/Order/OrderDetails'
import CategoryDetails from './pages/Category/Category'
import Settings from './pages/Setting/Settings'
import Commissions from './pages/Commission/Commissions'
import CategoryCommissions from './pages/Commission/CategoryCommissions'
import Statements from './pages/Commission/Statements'
import Transactions from './pages/Commission/Transactions'
import Payouts from './pages/Commission/Payouts'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]} />}>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/brands' element={<Brands />} />
            <Route path='/brands/:id' element={<Brand />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/categories/:id' element={<CategoryDetails />} />
            <Route path='/commissions' element={<Commissions />} >
              <Route index element={<CategoryCommissions />}></Route>
              <Route path='statements' element={<Statements />}></Route>
              <Route path='transactions' element={<Transactions />}></Route>
              <Route path='vendor-payouts' element={<Payouts />}></Route>
            </Route>
            <Route path='/products' element={<Products />} />
            <Route path='/products/:id' element={<ProductDetails />} />
            <Route path='/vendors' element={<Vendors />} />
            <Route path='/vendors/:id' element={<Vendor />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/orders/:id' element={<OrderDetails />} />
            <Route path='/settings' element={<Settings />} />
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
