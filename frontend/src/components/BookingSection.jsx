import React from 'react';

const BookingSection = () => {
  return (
    <section className="text-white bg-black w-full">
      {/* Banner */}
      <div
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/DormitoryBG.jpg)' }}
      >
         <h1 className="text-4xl border-2 px-6 py-2 text-center text-white">BOOKING NOW</h1>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-8 bg-white text-black">
        {[
            { src: '/roombooking.jpg', label: 'ROOM BOOKING' },
            { src: '/walkin.jpg', label: 'WALK - IN BOOKING' },
            { src: '/advance.jpg', label: 'ADVANCE BOOKING' },
        ].map(({ src, label }) => (
        <div key={label} className="text-center w-full md:w-1/3">
            <img src={src} alt={label} className="rounded-lg w-full h-40 object-cover shadow-md" />
            <p className="mt-2 font-semibold">{label}</p>
        </div>
        ))}
      </div>
    </section>
  );
};

export default BookingSection;
