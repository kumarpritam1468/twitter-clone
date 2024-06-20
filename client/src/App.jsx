import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import SignUpPage from "./pages/auth/SignUpPage"
import HomePage from "./pages/home/HomePage"
import { Toaster } from "react-hot-toast"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import LoadingSpinner from "./components/common/LoadingSpinner"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import { useMutation, useQuery } from '@tanstack/react-query'

function App() {
  const { isLoading, data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if(data.error) return null;

        if (!response.ok) {
          throw new Error(data.error || "Something Went Wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry:false
  })

  if (isLoading) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Router>
      <div className='flex max-w-6xl mx-auto'>
        <Sidebar />
        <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        </Routes>
        <RightPanel />
        <Toaster />
      </div>
    </Router>
  )
}

export default App
