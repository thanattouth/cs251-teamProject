import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PaymentHistory = ({ user }) => {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (!user?.Tenant_ID) return
    axios.get(`http://localhost:5000/api/payment/tenant/${user.Tenant_ID}`)
      .then(res => setPayments(res.data))
      .catch(err => console.error('Error loading payments:', err))
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">ประวัติการชำระเงิน</h2>
      {payments.length === 0 ? (
        <p className="text-gray-600">ยังไม่มีการชำระเงิน</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">วันที่ชำระ</th>
              <th className="p-2">ยอดเงิน</th>
              <th className="p-2">ยอดบิล</th>
              <th className="p-2">วันครบกำหนด</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.Payment_ID} className="text-center border-t">
                <td className="p-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="p-2">฿{payment.amount}</td>
                <td className="p-2">฿{payment.total_amount}</td>
                <td className="p-2">{new Date(payment.due_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PaymentHistory
