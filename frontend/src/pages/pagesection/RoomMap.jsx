import React from 'react';

const RoomMap = ({ onSelect, onClose }) => {
  const handleSelectRoom = (roomNumber) => {
    onSelect(roomNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">เลือกห้องพัก</h2>

        {[5, 4, 3, 2, 1].map((floor) => (
          <div key={floor} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Floor {floor}</h3>

            <div className="flex justify-center items-start gap-8">
              {/* Left side */}
              <div className="flex flex-col items-center mr-2">
                <span className="text-sm text-gray-500 mb-1">ฝั่งซ้าย</span>
                <div className="flex gap-3">
                  {[1, 2].map((i) => {
                    const room = `F${floor}R${i}`;
                    return (
                      <button
                        key={room}
                        onClick={() => handleSelectRoom(room)}
                        className="w-20 h-20 rounded-md font-semibold bg-green-100 hover:bg-green-200 text-green-800 transition"
                      >
                        {room}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* hallway */}
              <div className="w-8 h-full border-l border-r border-gray-400" />

              {/* Right side */}
              <div className="flex flex-col items-center ml-2">
                <span className="text-sm text-gray-500 mb-1">ฝั่งขวา</span>
                <div className="flex gap-3">
                  {[3, 4, 5].map((i) => {
                    const room = `F${floor}R${i}`;
                    return (
                      <button
                        key={room}
                        onClick={() => handleSelectRoom(room)}
                        className="w-20 h-20 rounded-md font-semibold bg-green-100 hover:bg-green-200 text-green-800 transition"
                      >
                        {room}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            ✖ ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomMap;
