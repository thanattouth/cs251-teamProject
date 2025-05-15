import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminBillPayment = () => {
  const [bills, setBills] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState('')

  // โหลดบิล
  useEffect(() => {
    axios.get('http://localhost:5000/api/bill/all')
      .then(res => {
        const unpaid = res.data.filter(b => b.bill_status === 'unpaid')
        setBills(unpaid)
      })
      .catch(err => console.error('Error loading bills:', err))
  }, [])

  // โหลดรายชื่อพนักงาน
  useEffect(() => {
    axios.get('http://localhost:5000/api/employee')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Error loading employees:', err))
  }, [])

  // ยืนยันการชำระเงิน
  const handlePayment = (bill) => {
    if (!selectedEmployee) {
      alert('กรุณาเลือกผู้รับเงินก่อน')
      return
    }

    axios.post('http://localhost:5000/api/payment', {
      Tenant_ID: bill.Tenant_ID,
      Bill_ID: bill.Bill_ID,
      Employee_ID: selectedEmployee,
      amount: bill.total_amount
    })
      .then(() => {
        alert('บันทึกการชำระเงินเรียบร้อย')
        setBills(prev => prev.filter(b => b.Bill_ID !== bill.Bill_ID))
      })
      .catch((err) => {
        console.error('Payment error:', err)
        alert('เกิดข้อผิดพลาดในการบันทึกการชำระเงิน')
      })
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">ยืนยันการชำระเงิน</h2>

      {/* เลือกพนักงานผู้รับเงิน */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">เลือกผู้รับเงิน</label>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">-- กรุณาเลือกพนักงาน --</option>
          {employees.map(emp => (
            <option key={emp.Employee_ID} value={emp.Employee_ID}>
              {emp.firstname} {emp.lastname} ({emp.position_type})
            </option>
          ))}
        </select>
      </div>

      {/* ตารางรายการบิล */}
      {bills.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">ไม่มีบิลที่รอชำระ</p>
      ) : (
        <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">บิล</th>
                <th className="px-4 py-2">ห้อง</th>
                <th className="px-4 py-2">ค่าเช่า</th>
                <th className="px-4 py-2">ค่าน้ำ</th>
                <th className="px-4 py-2">ค่าไฟ</th>
                <th className="px-4 py-2">ค่าซ่อม</th>
                <th className="px-4 py-2 font-semibold">รวม</th>
                <th className="px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {bills.map(bill => (
                <tr key={bill.Bill_ID} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">#{bill.Bill_ID}</td>
                  <td className="px-4 py-2">{bill.Room_ID}</td>
                  <td className="px-4 py-2">฿{bill.rent}</td>
                  <td className="px-4 py-2">฿{bill.water_fee}</td>
                  <td className="px-4 py-2">฿{bill.electric_fee}</td>
                  <td className="px-4 py-2">฿{bill.repair_cost || 0}</td>
                  <td className="px-4 py-2 font-semibold text-green-600">฿{bill.total_amount}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handlePayment(bill)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm transition"
                    >
                      ยืนยันชำระ
                    </button>
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

export default AdminBillPayment
