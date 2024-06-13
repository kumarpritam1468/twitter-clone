import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import SignUpPage from "./pages/auth/SignUpPage"
import HomePage from "./pages/home/HomePage"

function App() {
  return (
    <Router>
      <div className='flex max-w-6xl mx-auto'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
