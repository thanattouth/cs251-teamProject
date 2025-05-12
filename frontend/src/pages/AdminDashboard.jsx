import React, { useState } from 'react';

const FunctionBox = () => (
  <div className="bg-gray-100 text-center py-8 px-6 rounded-lg">function</div>
);

const SectionLayout = ({ count = 5 }) => (
  <div className="col-span-3 bg-white rounded-xl shadow p-6">
    <div className={`grid grid-flow-col auto-cols-fr gap-4 mb-6 overflow-x-auto`}>
      {Array.from({ length: count }).map((_, idx) => (
        <FunctionBox key={idx} />
      ))}
    </div>
    <div className="bg-gray-200 h-[400px] rounded-lg" />
  </div>
);

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const menu = [
    { key: 'dashboard', label: 'dashboard', count: 0 },
    { key: 'tenant', label: 'tenant mng', count: 3 },
    { key: 'room', label: 'room & booking', count: 5 },
    { key: 'lease', label: 'lease', count: 4 },
    { key: 'billing', label: 'billing & payment', count: 4 },
    { key: 'employee', label: 'employee mng', count: 3 },
    { key: 'maintenance', label: 'maintenance mng', count: 4 },
    { key: 'inventory', label: 'inventory mng', count: 3 },
  ];

  const current = menu.find((m) => m.key === activePage);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl text-xl font-bold text-center">Dormitory Hub</div>
        <ul className="space-y-2 text-sm">
          {menu.map(({ key, label }) => (
            <li
              key={key}
              onClick={() => setActivePage(key)}
              className={`cursor-pointer px-4 py-2 rounded-xl transition ${
                activePage === key
                  ? 'bg-white font-medium text-black shadow'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {activePage === key ? '●' : '○'} {label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-3 gap-6">
        {activePage === 'dashboard' ? (
          <div className="col-span-3 bg-white rounded-xl shadow p-6">
            <h1 className="text-xl font-semibold">Welcome to Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Select a section from the left menu.</p>
          </div>
        ) : (
          <SectionLayout count={current.count} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
