import './App.css'
import { Route, Routes, Link } from 'react-router-dom';
import Login from './feature/login'
import Signup from './feature/signup'
import HomeDashboard from './pages/main_page/dashboard'
import LandingPage from './pages/LandingPage'
import MemoryLane from './pages/main_page/memory-lane'
import CalorieTracker from './pages/main_page/calorie-tracker'
import BudgetTracker from './pages/main_page/budget-tracker'
import MemoryLaneUpload from './feature/memory-uploader/MemoryLaneUpload';
import EditBudgetModal from './feature/bt-uploader/edit-budget';
import AddTransactionModal from "./feature/bt-uploader/add-transaction";


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<HomeDashboard />} />
        <Route path="/memory-lane" element={<MemoryLane />} />
        <Route path="/add-memory" element={<MemoryLaneUpload />} />
        <Route path="/calorie-tracker" element={<CalorieTracker />} />
        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/edit-budget" element={<EditBudgetModal />} />
        <Route path="/add-transaction" element={<AddTransactionModal />} />
      </Routes>
    </>
  )
}

export default App
