import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PublicRoute from './components/PublicRoute'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import EditUser from './pages/EditUser'



function App() {
  const [isAuthenticated, setAuth] = useState(!!localStorage.getItem("token"))

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setAuth={setAuth}/>
      <div>
        <Routes>
          <Route path="/" element={<Home/> }/>
          <Route path="/signin" element={ <PublicRoute> <SignIn setAuth={setAuth}/> </PublicRoute> }/>
          <Route path="/signup" element={ <PublicRoute> <SignUp/> </PublicRoute> }/>
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
          <Route path="/edit-user" element={ <ProtectedRoute> <EditUser setAuth={setAuth} /> </ProtectedRoute> }/>
        </Routes>
      </div>
    </Router>
  )
  
}

export default App
