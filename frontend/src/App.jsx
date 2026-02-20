import './App.css'
import { Route, Routes, Link } from 'react-router-dom';
import Login from './feature/login'
import Signup from './feature/signup'
import HomeDashboard from './feature/dashboard'
import LandingPage from './pages/LandingPage'
import MemoryLane from './feature/memory-lane'
import CalorieTracker from './feature/calorie-tracker'
import BudgetTracker from './feature/budget-tracker'
import AddMemory from './feature/add-memory';
import MemoryUploadContainer from './feature/memory-uploader/MemoryUploadContainer';
import MemoryLaneUpload from './feature/memory-uploader/MemoryLaneUpload';


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/dashboard" element={<HomeDashboard />}/>
        <Route path="/memory-lane" element={<MemoryLane />}/>
        <Route path="/add-memory" element={<MemoryLaneUpload />}/>
        <Route path="/calorie-tracker" element={<CalorieTracker />}/> 
        <Route path="/budget-tracker" element={<BudgetTracker />}/>
      </Routes>
    </>
  )
}

export default App
