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
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">ยืนยันการชำระเงิน</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">เลือกผู้รับเงิน:</label>
        <select
          className="border rounded px-2 py-1 w-full md:w-1/2"
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

      {bills.length === 0 ? <p>ไม่มีบิลที่รอชำระ</p> : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-2">บิล</th>
              <th className="p-2">ห้อง</th>
              <th className="p-2">ค่าเช่า</th>
              <th className="p-2">ค่าน้ำ</th>
              <th className="p-2">ค่าไฟ</th>
              <th className="p-2">ค่าซ่อม</th>
              <th className="p-2">รวม</th>
              <th className="p-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.Bill_ID} className="text-center border-t">
                <td className="p-2">#{bill.Bill_ID}</td>
                <td className="p-2">{bill.Room_ID}</td>
                <td className="p-2">฿{bill.rent}</td>
                <td className="p-2">฿{bill.water_fee}</td>
                <td className="p-2">฿{bill.electric_fee}</td>
                <td className="p-2">฿{bill.repair_cost || 0}</td>
                <td className="p-2 font-semibold">฿{bill.total_amount}</td>
                <td className="p-2">
                  <button
                    onClick={() => handlePayment(bill)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >ยืนยันชำระ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminBillPayment
