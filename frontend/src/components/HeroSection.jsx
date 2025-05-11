import React, { useEffect, useState } from 'react';

export default function HeroSection() {
  const images = [
    './hero-bg1.jpg',
    './hero-bg2.jpg',
    './hero-bg3.jpg',
    './hero-bg4.jpg',
  ];
  const [index, setIndex] = useState(0);

  // เปลี่ยนภาพอัตโนมัติทุก 5 วินาที
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const changeImage = (direction) => {
    setIndex((prev) => (prev + direction + images.length) % images.length);
  };

  return (
    <section className="w-full h-screen bg-cover bg-center relative">
      {/* รูป carousel */}
      <img
        src={images[index]}
        alt="Dorm Slide"
        className="absolute w-full h-full object-cover opacity-30"
      />

      {/* ปุ่มลูกศร */}
      <button
          onClick={() => changeImage(-1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/70 rounded-full flex items-center justify-center shadow hover:bg-white transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 rotate-180">
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke="black" strokeWidth="2" fill="white" />
        </svg>
      </button>

      <button
          onClick={() => changeImage(1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/70 rounded-full flex items-center justify-center shadow hover:bg-white transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke="black" strokeWidth="2" fill="white" />
        </svg>
      </button>

      {/* กล่องปุ่ม Login/SignUp */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="bg-white/0 border-5 border-black rounded-[32px] px-20 py-12 text-center">
          <h1 className="font-inter text-[96px] font-semibold mb-8">Dormitory Hub</h1>

          {/* กล่องปุ่มรวม */}
          <div className="relative w-[474px] h-[88px] mx-auto">
            {/* พื้นหลังวงรี */}
            <div className="absolute left-0 top-0 w-[474px] h-[88px] border-5 border-white rounded-full z-0"></div>

            {/* ปุ่ม Login */}
            <button className="absolute left-0 top-0 w-[200px] h-[88px] text-[32px] font-normal bg-transparent rounded-[30px] z-10 hover:bg-white/30 transition">
              sign in
            </button>

            {/* ปุ่ม Sign up */}
            <button className="absolute right-0 top-0 w-[274px] h-[88px] text-[32px] font-normal bg-white rounded-[30px] border-[5px] border-white z-20 shadow-sm hover:bg-gray-100 transition -ml-6">
              sign up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
