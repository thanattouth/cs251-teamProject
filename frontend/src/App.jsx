import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminNavbar from './components/AdminNavbar'
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
import MyBookings from './pages/MyBookings'
import MyRoomDetails from './pages/MyRoomDetails'
import MyRepairs from './pages/MyRepairs'
import ReportRepair from './pages/ReportRepair'
import AllRepairsAdmin from './pages/AllRepairsAdmin'
import CompleteRepairForm from './pages/CompleteRepairForm'

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
                <Route path="/signin" element={<PublicRoute> <SignIn setAuth={setAuth} /> </PublicRoute>} />
                <Route path="/signup" element={<PublicRoute> <SignUp /> </PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                <Route path="/edit-user" element={<ProtectedRoute> <EditUser setAuth={setAuth} /> </ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute> <BookRoom /> </ProtectedRoute>} />
                <Route path="/my-booking" element={<ProtectedRoute> <MyBookings user={JSON.parse(localStorage.getItem('user'))} /> </ProtectedRoute>} />
                <Route path="/my-room" element={<ProtectedRoute> <MyRoomDetails user={JSON.parse(localStorage.getItem('user'))} /> </ProtectedRoute>} />
                <Route path="/my-repairs" element={<ProtectedRoute> <MyRepairs  user={JSON.parse(localStorage.getItem('user'))} /> </ProtectedRoute>} />
                <Route path="/report-repair" element={<ProtectedRoute> <ReportRepair  user={JSON.parse(localStorage.getItem('user'))} /> </ProtectedRoute>} />
              </Routes>
            </>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <>
              <AdminNavbar />
              <Routes>
                <Route path="signin" element={<AdminSignIn setAdminAuth={setAdminAuth} />} />
                <Route path="dashboard" element={<AdminProtectedRoute> <AdminDashboard /> </AdminProtectedRoute>} />
                <Route path="dormitory" element={<AdminProtectedRoute> <Dormitory /> </AdminProtectedRoute>} />
                <Route path="add-dormitory" element={<AdminProtectedRoute> <AddDormitory /> </AdminProtectedRoute>} />
                <Route path="rooms" element={<AdminProtectedRoute> <RoomList /> </AdminProtectedRoute>} />
                <Route
                  path="dormitory/:Dormitory_ID/rooms"
                  element={<AdminProtectedRoute> <RoomList /> </AdminProtectedRoute>}
                />
                <Route path="employee/add" element={<AdminProtectedRoute> <AddEmployee /> </AdminProtectedRoute>} />
                <Route path="employee" element={<AdminProtectedRoute> <EmployeeList /> </AdminProtectedRoute>} />
                <Route path="tenant" element={<AdminProtectedRoute> <TenantList /> </AdminProtectedRoute>} />
                <Route path="furniture" element={<AdminProtectedRoute> <FurnitureList /> </AdminProtectedRoute>} />
                <Route path="booking" element={<AdminProtectedRoute> <AdminBookingDashboard /> </AdminProtectedRoute>} />
                <Route path="lease" element={<AdminProtectedRoute> <AddLease /> </AdminProtectedRoute>} />
                <Route path="repairs" element={<AdminProtectedRoute> <AllRepairsAdmin  /> </AdminProtectedRoute>} />
                <Route path="repairs/complete/:requestId" element={<AdminProtectedRoute> <CompleteRepairForm /> </AdminProtectedRoute>} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
