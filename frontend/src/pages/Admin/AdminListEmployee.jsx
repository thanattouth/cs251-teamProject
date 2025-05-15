import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [extra, setExtra] = useState({ housekeepers: [], technicians: [] })
  const [edit, setEdit] = useState(null)
  const [editFloor, setEditFloor] = useState('')
  const [editSpecialty, setEditSpecialty] = useState('')
  const [editShiftStart, setEditShiftStart] = useState('')
  const [editShiftEnd, setEditShiftEnd] = useState('')
  const [editDepartment, setEditDepartment] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [empRes, extraRes] = await Promise.all([
        axios.get('http://localhost:5000/api/employee'),
        axios.get('http://localhost:5000/api/employee/extra')
      ])
      setEmployees(empRes.data)
      setExtra(extraRes.data)
    } catch {
      setEmployees([])
      setExtra({ housekeepers: [], technicians: [] })
    }
  }

  const housekeeperMap = Object.fromEntries(extra.housekeepers.map(h => [h.Employee_ID, h.Floor_assigned]))
  const technicianMap = Object.fromEntries(extra.technicians.map(t => [t.Employee_ID, t.specialty]))
  const guardMap = Object.fromEntries(extra.guards?.map(g => [g.Employee_ID, g.Shift]) || [])
  const managerMap = Object.fromEntries(extra.managers?.map(m => [m.Employee_ID, m.Department]) || [])

  const handleEdit = (type, id, value, emp) => {
    setEdit({ type, id, emp })
    setEditFloor(housekeeperMap[id] || '')
    setEditSpecialty(technicianMap[id] || '')
    setEditShiftStart((guardMap[id] || '').split('-')[0] || '')
    setEditShiftEnd((guardMap[id] || '').split('-')[1] || '')
    setEditDepartment(managerMap[id] || '')
  }

  const handleSave = async () => {
    if (editFloor.trim()) {
      await axios.put(`http://localhost:5000/api/employee/housekeeper/${edit.id}`, { Floor_assigned: editFloor })
    }
    if (editSpecialty.trim()) {
      await axios.put(`http://localhost:5000/api/employee/technician/${edit.id}`, { specialty: editSpecialty })
    }
    const shiftValue = editShiftStart && editShiftEnd ? `${editShiftStart}-${editShiftEnd}` : ''
    if (shiftValue) {
      await axios.put(`http://localhost:5000/api/employee/guard/${edit.id}`, { Shift: shiftValue })
    }
    if (editDepartment.trim()) {
      await axios.put(`http://localhost:5000/api/employee/manager/${edit.id}`, { Department: editDepartment })
    }
    await fetchData()
    setEdit(null)
    setEditFloor('')
    setEditSpecialty('')
    setEditShiftStart('')
    setEditShiftEnd('')
    setEditDepartment('')
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">รายชื่อพนักงาน</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
          onClick={() => navigate('/admin/employee/add')}
        >
          + เพิ่มพนักงาน
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">รหัสพนักงาน</th>
              <th className="px-4 py-3">รหัสบัตรประชาชน</th>
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">นามสกุล</th>
              <th className="px-4 py-3">วันที่เริ่มงาน</th>
              <th className="px-4 py-3">ตำแหน่ง</th>
              <th className="px-4 py-3">ชั้นที่รับผิดชอบ</th>
              <th className="px-4 py-3">ทักษะพิเศษ</th>
              <th className="px-4 py-3">เวลาเข้ากะ</th>
              <th className="px-4 py-3">ฝ่าย/แผนก</th>
              <th className="px-4 py-3 text-center">แก้ไข</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center px-4 py-6 text-gray-500">ไม่พบข้อมูลพนักงาน</td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.Employee_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{emp.Employee_ID}</td>
                  <td className="px-4 py-3">{emp.ID_card_number}</td>
                  <td className="px-4 py-3">{emp.firstname}</td>
                  <td className="px-4 py-3">{emp.lastname}</td>
                  <td className="px-4 py-3">{emp.hire_date?.slice(0, 10)}</td>
                  <td className="px-4 py-3">{emp.position_type}</td>
                  <td className="px-4 py-3">{housekeeperMap[emp.Employee_ID] || '-'}</td>
                  <td className="px-4 py-3">{technicianMap[emp.Employee_ID] || '-'}</td>
                  <td className="px-4 py-3">{guardMap[emp.Employee_ID] || '-'}</td>
                  <td className="px-4 py-3">{managerMap[emp.Employee_ID] || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium px-3 py-1 rounded transition"
                      onClick={() =>
                        handleEdit(emp.position_type, emp.Employee_ID,
                          emp.position_type === 'Housekeeper' ? (housekeeperMap[emp.Employee_ID] || '') :
                          emp.position_type === 'Technician' ? (technicianMap[emp.Employee_ID] || '') : '', emp)
                      }
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal edit part is unchanged, still styled similarly */}
    {edit && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-800">แก้ไขข้อมูลพนักงาน</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div><b>รหัสพนักงาน:</b> {edit.emp.Employee_ID}</div>
            <div><b>รหัสบัตรประชาชน:</b> {edit.emp.ID_card_number}</div>
            <div><b>ชื่อ:</b> {edit.emp.firstname}</div>
            <div><b>นามสกุล:</b> {edit.emp.lastname}</div>
            <div><b>วันที่เริ่มงาน:</b> {edit.emp.hire_date?.slice(0, 10)}</div>
            <div><b>ตำแหน่ง:</b> {edit.emp.position_type}</div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">ชั้นที่รับผิดชอบ (Housekeeper เท่านั้น)</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={editFloor}
                onChange={e => setEditFloor(e.target.value)}
                placeholder="Floor 0 - 4"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">ทักษะพิเศษ (Technician เท่านั้น)</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={editSpecialty}
                onChange={e => setEditSpecialty(e.target.value)}
                placeholder="เช่น ไฟฟ้า, คอมพิวเตอร์"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">เวลาเข้ากะ (Security guard เท่านั้น)</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={editShiftStart}
                  onChange={e => setEditShiftStart(e.target.value)}
                />
                <span className="text-gray-500 self-center">-</span>
                <input
                  type="time"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  value={editShiftEnd}
                  onChange={e => setEditShiftEnd(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-600">ฝ่าย/แผนก (Manager เท่านั้น)</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={editDepartment}
                onChange={e => setEditDepartment(e.target.value)}
                placeholder="เช่น บัญชี, วิศวกรรม"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              onClick={() => setEdit(null)}
            >
              ยกเลิก
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
              disabled={!editFloor.trim() && !editSpecialty.trim() && (!editShiftStart || !editShiftEnd) && !editDepartment.trim()}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default EmployeeList
