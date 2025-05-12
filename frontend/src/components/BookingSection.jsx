import React from 'react';

const BookingSection = () => {
  return (
    <section className="w-full bg-white py-10 px-4 flex flex-col items-center space-y-10">
      {/* กล่องดำล้อมรูปภาพ */}
      <div className="bg-black rounded-xl p-6 w-full max-w-[1800px]">
        <div className="relative rounded-md overflow-hidden w-full h-64">
          {/* รูปที่ขยายเต็มพื้นที่กล่องดำ */}
          <img
            src="/DormitoryBG.jpg"
            alt="Dormitory"
            className="absolute inset-0 w-[720px] h-full object-cover opacity-60 mx-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white px-10 py-8">
              <h1 className="text-white text-2xl md:text-4xl font-bold">BOOKING NOW</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black p-20 w-full">
        <div className="flex flex-wrap justify-center items-center gap-12 mx-auto max-w-6xl">
    {[
      { src: '/roombooking.jpg', label: 'ROOM BOOKING' },
      { src: '/walkin.jpg', label: 'WALK - IN BOOKING' },
      { src: '/advance.jpg', label: 'ADVANCE BOOKING' },
    ].map(({ src, label }) => (
      <div
        key={label}
        className="bg-white text-center w-[350px] rounded-xl"
      >
         <div className="overflow-hidden rounded-t-lg">
          <img
            src={src}
            alt={label}
            className="w-100 h-62 object-cover"
          />
        </div>
        <p className="mt-2 font-semibold text-black">{label}</p>
      </div>
    ))}
  </div>
</div>
    </section>
  );
};

export default BookingSection;
