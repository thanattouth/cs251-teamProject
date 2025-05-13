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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">รายการบิลของฉัน</h2>
      {bills.length === 0 ? (
        <p className="text-gray-600">ยังไม่มีบิล</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">วันที่ออก</th>
              <th className="p-2">ค่าเช่า</th>
              <th className="p-2">ค่าน้ำ</th>
              <th className="p-2">ค่าไฟ</th>
              <th className="p-2">ค่าซ่อมบำรุงเดือนนี้</th>
              <th className="p-2">รวม</th>
              <th className="p-2">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.Bill_ID} className="text-center border-t">
                <td className="p-2">{new Date(bill.Bill_date).toLocaleDateString()}</td>
                <td className="p-2">฿{bill.rent}</td>
                <td className="p-2">฿{bill.water_fee}</td>
                <td className="p-2">฿{bill.electric_fee}</td>
                <td className="p-2">฿{bill.repair_cost || 0}</td>
                <td className="p-2">฿{bill.total_amount}</td>
                <td className={`p-2 ${bill.bill_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{bill.bill_status === 'paid' ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default BillList
