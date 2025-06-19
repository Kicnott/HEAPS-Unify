
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import './classes/index.jsx'

// Pages
import HomePage from "./pages/home.jsx"
import LoginPage from "./pages/login.jsx"
import TestServer from './pages/test-server.jsx'

function App() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/testserver" element={<TestServer />}/>
    </Routes>
  ) // Creates routes to navigate through the web page.
  // A route is like a url to go to, where the function will be loaded
}

export default App
