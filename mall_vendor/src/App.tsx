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

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path='wizard' element={<Wizard />} />
        <Route path='create' element={<CreateStore />} />
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile/:id' element={<UserProfile />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
