import React from 'react'
import AdminNavbar from './AdminNavbar'
import { useNavigate } from 'react-router-dom'

const menuManagement = [
//   { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Dormitory & Room', path: '/admin/dormitory' },
  { label: 'Employee Management', path: '/admin/employee' },
  { label: 'Tenant Management', path: '/admin/tenant' },
]
const menu = [
  { label: 'Booking', path: '/admin/booking' },
  { label: 'Lease', path: '/admin/lease' },
  { label: 'Billing', path: '/admin/bill' },
  { label: 'Payment', path: '/admin/bill-payment' },
  { label: 'Maintenance Management', path: '/admin/repairs' },
]

const AdminSidebar = ({ children }) => {
  const navigate = useNavigate()

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-gray-200 p-4 space-y-4">
          <div className="bg-white p-4 rounded-xl text-xl font-bold text-center">
            Dormitory Hub
          </div>
          <ul className="space-y-2 text-sm border-b border-gray-300">
            {menuManagement.map(({ label, path }) => (
              <li
                key={path}
                onClick={() => navigate(path)}
                className="cursor-pointer px-4 py-2 rounded-xl transition text-gray-600 hover:text-black hover:bg-white"
              >
                {label}
              </li>
            ))}
          </ul>
                    <ul className="space-y-2 text-sm">
            {menu.map(({ label, path }) => (
              <li
                key={path}
                onClick={() => navigate(path)}
                className="cursor-pointer px-4 py-2 rounded-xl transition text-gray-600 hover:text-black hover:bg-white"
              >
                {label}
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  )
}

export default AdminSidebar