import React from 'react';

export default function HeroSection() {
  return (
    <section className="w-full h-screen bg-[url('./hero-bg.png')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/0 border-5 border-black rounded-[32px] px-20 py-12 text-center">
        <h1 className="font-inter text-[96px] font-semibold mb-8">Dormitory Hub</h1>

        {/* กล่องปุ่มรวม */}
        <div className="relative w-[474px] h-[88px] mx-auto">
          {/* พื้นหลังวงรี */}
          <div className="absolute left-0 top-0 w-[474px] h-[88px] border-5 border-white rounded-full z-0"></div>

          {/* ปุ่ม Login (เล็กลง) */}
          <button className="absolute left-0 top-0 w-[200px] h-[88px] text-[32px] font-normal bg-transparent rounded-[30px] z-10 hover:bg-white/10 transition">
            Login
          </button>

          {/* ปุ่ม Sign up (วงรีเด่น ชิดขวา) */}
          <button className="absolute right-0 top-0 w-[274px] h-[88px] text-[32px] font-normal bg-white rounded-[30px] border-[5px] border-white z-20 shadow-sm hover:bg-gray-100 transition -ml-6">
            sign up
          </button>
        </div>
      </div>
    </section>
  );
}
