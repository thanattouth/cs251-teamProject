import React, { useEffect, useState } from 'react'
import axios from 'axios'

function TenantList() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTenants = () => {
    axios.get('http://localhost:5000/api/tenant')
      .then(res => {
        setTenants(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('ไม่สามารถโหลดข้อมูลผู้เช่าได้')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleCheckout = async (tenantId) => {
    if (!window.confirm("ยืนยันการเอาผู้ใช้ออกจากห้องพัก?")) return

    try {
      await axios.put(`http://localhost:5000/api/tenant/${tenantId}/checkout`)
      alert("นำผู้ใช้ออกจากห้องพักเรียบร้อยแล้ว")
      fetchTenants()
    } catch (err) {
      console.error(err)
      alert("เกิดข้อผิดพลาดในการดำเนินการ")
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">รายชื่อผู้เช่าทั้งหมด</h2>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tenants.length === 0 ? (
        <p className="text-gray-500">ไม่มีข้อมูลผู้เช่า</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">รหัส</th>
                <th className="px-4 py-3 text-left">ชื่อ</th>
                <th className="px-4 py-3 text-left">นามสกุล</th>
                <th className="px-4 py-3 text-left">อีเมล</th>
                <th className="px-4 py-3 text-left">เบอร์โทร</th>
                <th className="px-4 py-3 text-left">เข้าพักเมื่อ</th>
                <th className="px-4 py-3 text-left">ห้อง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {tenants.map(t => (
                <tr key={t.Tenant_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{t.Tenant_ID}</td>
                  <td className="px-4 py-3 ">{t.firstname}</td>
                  <td className="px-4 py-3">{t.lastname}</td>
                  <td className="px-4 py-3">{t.email}</td>
                  <td className="px-4 py-3">{t.phone}</td>
                  <td className="px-4 py-3">{t.move_in_date?.slice(0, 10) || '-'}</td>
                  <td className="px-4 py-3" flex items-center gap-2>
                    {t.current_room_id || '-'}
                    {t.current_room_id && (
                      <button
                        onClick={() => handleCheckout(t.Tenant_ID)}
                        className="ml-2 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-medium px-2 py-1 rounded transition"
                      >
                        เอาออก
                      </button>
                    )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TenantList
