import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminSidebarLayout from './components/AdminSidebarLayout' // ✅ layout ที่มี navbar + sidebar
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import PublicRoute from './components/PublicRoute'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import EditUser from './pages/EditUser'
import Dormitory from './pages/Dormitory'
import AddDormitory from './pages/AddDormitory'
import RoomList from './pages/RoomList'
import AdminSignIn from './pages/AdminSignIn'
import AdminDashboard from './pages/AdminDashboard'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AddEmployee from './pages/AddEmployee'
import EmployeeList from './pages/EmployeeList'
import TenantList from './pages/TenantList'
import FurnitureList from './pages/FurnitureList'
import BookRoom from './pages/BookRoom'
import AdminBookingDashboard from './pages/AdminBookingDashboard'
import AddLease from './pages/AddLease'

function App() {
  const [isAuthenticated, setAuth] = useState(!!localStorage.getItem("token"))
  const [isAdminAuthenticated, setAdminAuth] = useState(!!localStorage.getItem("adminToken"))

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route
          path="/*"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} setAuth={setAuth} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<PublicRoute><SignIn setAuth={setAuth} /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/edit-user" element={<ProtectedRoute><EditUser setAuth={setAuth} /></ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
              </Routes>
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/signin" element={<AdminSignIn setAdminAuth={setAdminAuth} />} />

        {/* Admin Layout Routes - use layout with navbar+sidebar */}
        <Route
          path="/admin/dashboard"
          element={<AdminProtectedRoute><AdminSidebarLayout><AdminDashboard /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/dormitory"
          element={<AdminProtectedRoute><AdminSidebarLayout><Dormitory /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/add-dormitory"
          element={<AdminProtectedRoute><AdminSidebarLayout><AddDormitory /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/rooms"
          element={<AdminProtectedRoute><AdminSidebarLayout><RoomList /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/dormitory/:Dormitory_ID/rooms"
          element={<AdminProtectedRoute><AdminSidebarLayout><RoomList /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/employee/add"
          element={<AdminProtectedRoute><AdminSidebarLayout><AddEmployee /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/employee"
          element={<AdminProtectedRoute><AdminSidebarLayout><EmployeeList /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/tenant"
          element={<AdminProtectedRoute><AdminSidebarLayout><TenantList /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/furniture"
          element={<AdminProtectedRoute><AdminSidebarLayout><FurnitureList /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/booking"
          element={<AdminProtectedRoute><AdminSidebarLayout><AdminBookingDashboard /></AdminSidebarLayout></AdminProtectedRoute>}
        />
        <Route
          path="/admin/lease"
          element={<AdminProtectedRoute><AdminSidebarLayout><AddLease /></AdminSidebarLayout></AdminProtectedRoute>}
        />
      </Routes>
    </Router>
  )
}

export default App
