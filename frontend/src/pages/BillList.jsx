import React, { useEffect, useState } from 'react'
import axios from 'axios'

const BillList = ({ user }) => {
  const [bills, setBills] = useState([])

  useEffect(() => {
    if (!user?.Tenant_ID) return
    axios.get(`http://localhost:5000/api/bill/tenant/${user.Tenant_ID}`)
      .then(res => setBills(res.data))
      .catch(err => console.error('Error loading bills:', err))
  }, [user])

  const statusBadge = (status) => {
    const style = status === 'paid'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
        {status === 'paid' ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">รายการบิลของฉัน</h2>

      {bills.length === 0 ? (
        <p className="text-gray-600 text-center">ยังไม่มีบิล</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">วันที่ออก</th>
                <th className="px-4 py-3 text-right">ค่าเช่า</th>
                <th className="px-4 py-3 text-right">ค่าน้ำ</th>
                <th className="px-4 py-3 text-right">ค่าไฟ</th>
                <th className="px-4 py-3 text-right">ค่าซ่อมบำรุง</th>
                <th className="px-4 py-3 text-right">รวม</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 divide-y divide-gray-100">
              {bills.map((bill) => (
                <tr key={bill.Bill_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(bill.Bill_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">฿{Number(bill.rent).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">฿{Number(bill.water_fee).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">฿{Number(bill.electric_fee).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">฿{Number(bill.repair_cost || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-semibold">฿{Number(bill.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{statusBadge(bill.bill_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BillList
