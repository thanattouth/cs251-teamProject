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
    <div className="max-w-7xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ประวัติการชำระเงิน</h2>

      {payments.length === 0 ? (
        <p className="text-gray-600 text-center">ยังไม่มีการชำระเงิน</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">วันที่ชำระ</th>
                <th className="px-4 py-3 text-right">ยอดที่ชำระ</th>
                <th className="px-4 py-3 text-right">ยอดบิลทั้งหมด</th>
                <th className="px-4 py-3 text-left">วันครบกำหนด</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.Payment_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">฿{Number(payment.amount).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">฿{Number(payment.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{new Date(payment.due_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory
