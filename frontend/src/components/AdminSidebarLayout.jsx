// src/components/AdminSidebarLayout.jsx
import React from 'react'
import AdminNavbar from './AdminNavbar'
import { useNavigate } from 'react-router-dom'

const menu = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Tenant Management', path: '/admin/tenant' },
  { label: 'Room & Booking', path: '/admin/dormitory' },
  { label: 'Lease', path: '/admin/lease' },
  { label: 'Billing & Payment', path: '/admin/billing' },
  { label: 'Employee Management', path: '/admin/employee' },
  { label: 'Maintenance Management', path: '/admin/maintenance' },
  { label: 'Inventory Management', path: '/admin/inventory' },
]

const AdminSidebarLayout = ({ children }) => {
  const navigate = useNavigate()

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-gray-200 p-4 space-y-4">
          <div className="bg-white p-4 rounded-xl text-xl font-bold text-center">
            Dormitory Hub
          </div>
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

export default AdminSidebarLayout
