import React from 'react';

const ContactSection = () => {
  return (
    <section className="w-full bg-white py-10 px-4 flex flex-col items-center space-y-10">
      {/* กล่องดำบน (ภาพ + ข้อความ) */}
      <div className="bg-black rounded-xl p-6 w-full max-w-[1800px]">
        <div className="relative rounded-md overflow-hidden h-64 flex justify-center items-center">
          {/* ภาพ header (ไม่ขยายตามกล่อง) */}
          <img
            src="/DormitoryBG.jpg"
            alt="DormitoryBG"
            className="w-[720px] h-full object-cover opacity-60 rounded-md"
          />
          {/* ข้อความกลาง */}
          <div className="absolute">
            <div className="border-2 border-white px-10 py-8">
              <h1 className="text-white text-2xl md:text-4xl font-bold">CONTACT US</h1>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนล่างพื้นหลังดำ: map + contact */}
      <div className="w-full bg-black py-10 px-4 flex justify-center">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-[1100px]">
          {/* รูปแผนที่ (หรือแทนด้วย iframe ก็ได้) */}
          <div className="w-full md:w-2/3">
            <img
              src="/map.png" // หรือใช้ iframe Google Map ก็ได้
              alt="Map"
              className="w-full h-64 rounded-lg object-cover"
            />
          </div>

          {/* กล่องข้อมูลติดต่อ */}
          <div className="bg-white p-6 rounded-lg shadow-md text-black text-lg w-full md:w-1/3">
            <p><strong>Address:</strong><br />Maccurach building A<br />Bangkok, Bang Bon 10160</p>
            <p className="mt-4"><strong>Tel:</strong> 077-777-7777</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
