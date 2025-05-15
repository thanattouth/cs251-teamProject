import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSection = () => {
  const navigate = useNavigate();
  const images = [
    '/lobby2.jpg',
    '/lobby5.jpg',
    '/lobby6.jpg',
  ];
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 250); // wait before changing image to allow fade out
  };

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
      setFade(true);
    }, 250);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <section id="reservation" className="w-full bg-white flex flex-col items-center">
      {/* กล่อง wrapper ครึ่งบน */}
      <div className="relative flex flex-col md:flex-row w-full mt-20 mb-10 overflow-hidden min-h-[850px]">
        {/* รูปภาพพื้นหลังฝั่งขวา แบบเลื่อนได้ */}
        <div className="absolute top-0 right-0 w-[75%] h-full hidden md:block z-0">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img
            src={images[current]}
            alt="Booking Slide"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* ปุ่ม dot แสดงตำแหน่ง */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {images.map((_, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setFade(false);
                  setTimeout(() => {
                    setCurrent(idx);
                    setFade(true);
                  }, 250);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  idx === current ? 'bg-[#cb8e57]' : 'bg-white'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* กล่องข้อความด้านซ้าย */}
        <div className="relative z-10 bg-[#ededed] text-left px-0 py-50 w-full md:w-[30%] max-w-4xl">
          <div className="border-l-[4px] border-black pl-10 translate-x-62">
            <h1 className="text-[75px] font-serif text-black leading-tight mb-6 drop-shadow-lg">
              Reserve Your Room
            </h1>
            <p className="text-[27px] text-black">Rooms Available Now</p>
            <p className="font-bold text-black text-[20px] mt-1">Date: May 14, 2025</p>
            <button
              onClick={() => navigate('/booking')}
              className="mt-8 text-[#cb8e57] font-bold text-[30px] border border-[#cb8e57] px-8 py-2 rounded-full hover:bg-[#cb8e57] hover:text-white transition"
            >
              Booking Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
