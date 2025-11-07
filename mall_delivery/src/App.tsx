import { Routes, Route } from 'react-router-dom';
import './globals.css';
import LoginPage from './pages/login/Login';
import SignupPage from './pages/signup/Signup';
import OtpPage from './pages/otp/Otp';
import ForgotPasswordPage from './pages/forgot-password/ForgotPassword';
import RequireAuth from './components/RequireAuth';
import { DashboardLayout } from './components/dashboard-layout';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { StatisticsPage } from './pages/statistics/statistics-page';
import { DeliveryPage } from './pages/delivery/delivery-page';
import { SettingsPage } from './pages/settings/settings-page';


function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route element={<RequireAuth children={undefined} />}>
          <Route  element={<DashboardLayout children={undefined} />}>
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/statistics' element={<StatisticsPage />} />
            <Route path='/delivery' element={<DeliveryPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
