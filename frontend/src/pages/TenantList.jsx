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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">รายชื่อผู้เช่าทั้งหมด</h2>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tenants.length === 0 ? (
        <p>ไม่มีข้อมูลผู้เช่า</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">รหัสผู้เช่า</th>
              <th className="border px-2 py-1">ชื่อ</th>
              <th className="border px-2 py-1">นามสกุล</th>
              <th className="border px-2 py-1">อีเมล</th>
              <th className="border px-2 py-1">เบอร์โทร</th>
              <th className="border px-2 py-1">วันที่เข้าพัก</th>
              <th className="border px-2 py-1">ห้องที่พัก</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.Tenant_ID}>
                <td className="border px-2 py-1">{t.Tenant_ID}</td>
                <td className="border px-2 py-1">
                  {t.firstname}
                  {t.current_room_id && (
                    <button
                      onClick={() => handleCheckout(t.Tenant_ID)}
                      className="ml-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      เอาออก
                    </button>
                  )}
                </td>
                <td className="border px-2 py-1">{t.lastname}</td>
                <td className="border px-2 py-1">{t.email}</td>
                <td className="border px-2 py-1">{t.phone}</td>
                <td className="border px-2 py-1">{t.move_in_date || '-'}</td>
                <td className="border px-2 py-1">{t.current_room_id || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TenantList
