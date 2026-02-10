import './App.css'
import { Route, Routes, Link } from 'react-router-dom';
import Login from './feature/login'
import Signup from './feature/signup'
import LandingPage from './pages/LandingPage'
function App() {


  return (
    <>


      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </>
  )
}

export default App
