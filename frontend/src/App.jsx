import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//import Protect
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
//import User
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import EditUser from './pages/EditUser'
import BookRoom from './pages/BookRoom'
import MyBookings from './pages/MyBookings'
import MyRoomDetails from './pages/MyRoomDetails'
import MyRepairs from './pages/MyRepairs'
import ReportRepair from './pages/ReportRepair'
import BillList from './pages/BillList'
import PaymentHistory from './pages/PaymentHistory'
//import Admin
import AdminNavbar from './components/AdminNavbar'
import AdminSignIn from './pages/Admin/AdminSignin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Dormitory from './pages/Admin/AdminListDormitory'
import AddDormitory from './pages/Admin/AdminAddDormitory'
import RoomList from './pages/Admin/AdminListRoom'
import AddEmployee from './pages/Admin/AdminAddEmployee'
import EmployeeList from './pages/Admin/AdminListEmployee'
import TenantList from './pages/Admin/AdminListTenant'
import FurnitureList from './pages/Admin/AdminListFurniture'
import AdminBookingDashboard from './pages/Admin/AdminBookingDashboard'
import AddLease from './pages/Admin/AdminAddLease'
import AllRepairsAdmin from './pages/Admin/AdminAllRepairs'
import CompleteRepairForm from './pages/Admin/AdminCompleteRepair'
import AdminBillControl from './pages/Admin/AdminBillControl'
import AdminBillPayment from './pages/Admin/AdminBillPayment'

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
                <Route path="/payment" element={<ProtectedRoute> <PaymentHistory   user={JSON.parse(localStorage.getItem('user'))} /> </ProtectedRoute>} />
                <Route path="/bill" element={<ProtectedRoute> <BillList  user={JSON.parse(localStorage.getItem('user'))} /> </ProtectedRoute>} />
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
                <Route path="dormitory/:Dormitory_ID/rooms" element={<AdminProtectedRoute> <RoomList /> </AdminProtectedRoute>} />
                <Route path="employee/add" element={<AdminProtectedRoute> <AddEmployee /> </AdminProtectedRoute>} />
                <Route path="employee" element={<AdminProtectedRoute> <EmployeeList /> </AdminProtectedRoute>} />
                <Route path="tenant" element={<AdminProtectedRoute> <TenantList /> </AdminProtectedRoute>} />
                <Route path="furniture" element={<AdminProtectedRoute> <FurnitureList /> </AdminProtectedRoute>} />
                <Route path="booking" element={<AdminProtectedRoute> <AdminBookingDashboard /> </AdminProtectedRoute>} />
                <Route path="lease" element={<AdminProtectedRoute> <AddLease /> </AdminProtectedRoute>} />
                <Route path="repairs" element={<AdminProtectedRoute> <AllRepairsAdmin  /> </AdminProtectedRoute>} />
                <Route path="repairs/complete/:requestId" element={<AdminProtectedRoute> <CompleteRepairForm /> </AdminProtectedRoute>} />
                <Route path="bill" element={<AdminProtectedRoute> <AdminBillControl  /> </AdminProtectedRoute>} />
                <Route path="bill-payment" element={<AdminProtectedRoute> <AdminBillPayment  /> </AdminProtectedRoute>} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
