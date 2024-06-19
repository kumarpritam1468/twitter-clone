import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import SignUpPage from "./pages/auth/SignUpPage"
import HomePage from "./pages/home/HomePage"
import { Toaster } from "react-hot-toast"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"

function App() {
  return (
    <Router>
      <div className='flex max-w-6xl mx-auto'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
        <RightPanel />
        <Toaster />
      </div>
    </Router>
  )
}

export default App
