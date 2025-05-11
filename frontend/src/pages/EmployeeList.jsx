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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">รายชื่อพนักงาน</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/admin/employee/add')}
        >
          + Add Employee
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">รหัสพนักงาน</th>
            <th className="border px-2 py-1">รหัสบัตรประชาชน</th>
            <th className="border px-2 py-1">ชื่อ</th>
            <th className="border px-2 py-1">นามสกุล</th>
            <th className="border px-2 py-1">วันที่เริ่มงาน</th>
            <th className="border px-2 py-1">ตำแหน่ง</th>
            <th className="border px-2 py-1">ชั้นที่รับผิดชอบ</th>
            <th className="border px-2 py-1">ทักษะพิเศษ</th>
            <th className="border px-2 py-1">เวลาเข้ากะ</th>
            <th className="border px-2 py-1">ฝ่าย/แผนก</th>
            <th className="border px-2 py-1">แก้ไข</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4">No employee found</td>
            </tr>
          ) : (
            employees.map(emp => (
              <tr key={emp.Employee_ID}>
                <td className="border px-2 py-1">{emp.Employee_ID}</td>
                <td className="border px-2 py-1">{emp.ID_card_number}</td>
                <td className="border px-2 py-1">{emp.firstname}</td>
                <td className="border px-2 py-1">{emp.lastname}</td>
                <td className="border px-2 py-1">{emp.hire_date ? emp.hire_date.slice(0, 10) : ''}</td>
                <td className="border px-2 py-1">{emp.position_type}</td>
                <td className="border px-2 py-1">{housekeeperMap[emp.Employee_ID] || '-'}</td>
                <td className="border px-2 py-1">{technicianMap[emp.Employee_ID] || '-'}</td>
                <td className="border px-2 py-1">{guardMap[emp.Employee_ID] || '-'}</td>
                <td className="border px-2 py-1">{managerMap[emp.Employee_ID] || '-'}</td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleEdit(emp.position_type, emp.Employee_ID, 
                      emp.position_type === 'Housekeeper' ? (housekeeperMap[emp.Employee_ID] || '') :
                      emp.position_type === 'Technician' ? (technicianMap[emp.Employee_ID] || '') : '', emp)}
                  >
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {edit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-2">แก้ไขข้อมูลพนักงาน</h3>
            <div className="mb-2">
              <div><b>รหัสพนักงาน:</b> {edit.emp.Employee_ID}</div>
              <div><b>รหัสบัตรประชาชน:</b> {edit.emp.ID_card_number}</div>
              <div><b>ชื่อ:</b> {edit.emp.firstname}</div>
              <div><b>นามสกุล:</b> {edit.emp.lastname}</div>
              <div><b>วันที่เริ่มงาน:</b> {edit.emp.hire_date ? edit.emp.hire_date.slice(0, 10) : ''}</div>
              <div><b>ตำแหน่ง:</b> {edit.emp.position_type}</div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">ชั้นที่รับผิดชอบ (Housekeeper เท่านั้น)</label>
              <input
                className="border p-2 w-full"
                value={editFloor}
                onChange={e => setEditFloor(e.target.value)}
                placeholder="Floor 0 - 4"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">ทักษะพิเศษ (Technician เท่านั้น)</label>
              <input
                className="border p-2 w-full"
                value={editSpecialty}
                onChange={e => setEditSpecialty(e.target.value)}
                placeholder="computer"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">เวลาเข้ากะ (Security guard เท่านั้น)</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="border p-2 w-full"
                  value={editShiftStart}
                  onChange={e => setEditShiftStart(e.target.value)}
                />
                <span>-</span>
                <input
                  type="time"
                  className="border p-2 w-full"
                  value={editShiftEnd}
                  onChange={e => setEditShiftEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">ฝ่าย/แผนก (Manager เท่านั้น)</label>
              <input
                className="border p-2 w-full"
                value={editDepartment}
                onChange={e => setEditDepartment(e.target.value)}
                placeholder="Maccurach"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEdit(null)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={handleSave}
                disabled={!editFloor.trim() && !editSpecialty.trim() && (!editShiftStart.trim() || !editShiftEnd.trim()) && !editDepartment.trim()}
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