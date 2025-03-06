import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import RequireAuth from './components/RequireAuth'
import UserProfile from './pages/User/User'
import NotFound from './pages/NotFound/NotFound'
import Wizard from './pages/Wizard/Wizard'
import CreateStore from './pages/Create/CreateStore'
import Store from './pages/Settings/Store'
import Products from './pages/Products/Products'
import CreateProduct from './pages/Products/CreateProduct'
import Product from './pages/Products/Product'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path='wizard' element={<Wizard />} />
          <Route path='create' element={<CreateStore />} />
          <Route element={<Layout />}>
            <Route path='/dashboard/:store' element={<Dashboard />} />
            <Route path='/profile/:id' element={<UserProfile />} />
            <Route path='/settings/:store' element={<Store />} />
            <Route path='/products/:store' element={<Products />} />
            <Route path='/products/:store/:id' element={<Product />} />
            <Route path='/products/:store/:id/product-info' element={<CreateProduct />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
