import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PublicRoute from './components/PublicRoute';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EditUser from './pages/EditUser';
import Dormitory from './pages/Dormitory';
import AddDormitory from './pages/AddDormitory';
import RoomList from './pages/RoomList';
import AdminSignIn from './pages/AdminSignIn';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AddEmployee from './pages/AddEmployee';
import EmployeeList from './pages/EmployeeList';
import Reservation from './pages/Reservation';
import RoomMap from './components/RoomMap';

function App() {
  const [isAuthenticated, setAuth] = useState(!!localStorage.getItem('token'));
  const [isAdminAuthenticated, setAdminAuth] = useState(!!localStorage.getItem('adminToken'));

  return (
    <Router>
      <Routes>

        {/* ✅ User Layout with Navbar and Nested Routes */}
        <Route
          path="/"
          element={<Navbar isAuthenticated={isAuthenticated} setAuth={setAuth} />}
        >
          <Route index element={<Home />} />
          <Route path="room-map" element={<RoomMap />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="signin" element={<PublicRoute><SignIn setAuth={setAuth} /></PublicRoute>} />
          <Route path="signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="edit-user" element={<ProtectedRoute><EditUser setAuth={setAuth} /></ProtectedRoute>} />
        </Route>

        {/* ✅ Admin Routes */}
        <Route path="/admin/signin" element={
          <>
            <AdminNavbar />
            <AdminSignIn setAdminAuth={setAdminAuth} />
          </>
        } />

        <Route path="/admin/dashboard" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          </>
        } />

        <Route path="/admin/dormitory" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <Dormitory />
            </AdminProtectedRoute>
          </>
        } />

        <Route path="/admin/add-dormitory" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <AddDormitory />
            </AdminProtectedRoute>
          </>
        } />

        <Route path="/admin/rooms" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <RoomList />
            </AdminProtectedRoute>
          </>
        } />

        <Route path="/admin/dormitory/:Dormitory_ID/rooms" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <RoomList />
            </AdminProtectedRoute>
          </>
        } />

        <Route path="/admin/employee/add" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <AddEmployee />
            </AdminProtectedRoute>
          </>
        } />

        <Route path="/admin/employee" element={
          <>
            <AdminNavbar />
            <AdminProtectedRoute>
              <EmployeeList />
            </AdminProtectedRoute>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
