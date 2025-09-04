import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import LogoutPage from './pages/LogoutPage'
import AssetOverviewPage from './pages/AssetOverviewPage'
import PortfolioDashboardPage from './pages/PortfolioDashboardPage'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProtectedRoute><PortfolioDashboardPage /></ProtectedRoute>}/>
      {/* <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/overview/:ticker" element={<AssetOverviewPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
