import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//import Protect
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminSidebar from './components/AdminSidebar'
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
        <Route path="/admin/signin" element={<AdminSignIn setAdminAuth={setAdminAuth} />} />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminSidebar>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="dormitory" element={<Dormitory />} />
                  <Route path="add-dormitory" element={<AddDormitory />} />
                  <Route path="rooms" element={<RoomList />} />
                  <Route path="dormitory/:Dormitory_ID/rooms" element={<RoomList />} />
                  <Route path="employee/add" element={<AddEmployee />} />
                  <Route path="employee" element={<EmployeeList />} />
                  <Route path="tenant" element={<TenantList />} />
                  <Route path="furniture" element={<FurnitureList />} />
                  <Route path="booking" element={<AdminBookingDashboard />} />
                  <Route path="lease" element={<AddLease />} />
                  <Route path="repairs" element={<AllRepairsAdmin />} />
                  <Route path="repairs/complete/:requestId" element={<CompleteRepairForm />} />
                  <Route path="bill" element={<AdminBillControl />} />
                  <Route path="bill-payment" element={<AdminBillPayment />} />
                </Routes>
              </AdminSidebar>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
