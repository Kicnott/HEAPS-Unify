
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import './classes/index.jsx'

// Pages
import HomePage from "./pages/home.jsx"
import LoginPage from "./pages/login.jsx"

function App() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  )
}

export default App
