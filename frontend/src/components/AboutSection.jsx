import React from 'react';

export default function AboutSection() {
  return (
    <>
      {/* 🔲 กล่องข้อความ + รูปภาพ */}
      <section className="flex flex-col md:flex-row w-full h-auto">
        
        {/* ซ้าย: รูปภาพ */}
        <div className="bg-[#5F6752] md:w-[38%] w-full flex items-stretch justify-center pr-6">
          <img
            src="./hero-bg-about2.jpg"
            alt="Signature"
            className="w-full object-cover"
          />
        </div>

        {/* ขวา: ข้อความ (ไม่มีกล่องสีเทาอยู่ภายใน) */}
        <div className="md:w-[76%] w-full text-[#333] bg-white">
          <div className="px-10 md:px-20 py-20">
            <h2 className="text-4xl font-semibold text-black underline underline-offset-8 decoration-[#777F65] mb-8">
              About Us
            </h2>

            <h3 className="text-3xl font-semibold mb-6 underline underline-offset-4 decoration-[#777F65]">
              History
            </h3>

            <p className="leading-loose text-[20px] md:text-[22px]">
              หอพักก่อตั้งขึ้นเมื่อปี ค.ศ. 2025<br />
              ซึ่งมีแนวคิดที่จะสร้างที่พักสำหรับนักศึกษาที่ให้บรรยากาศอบอุ่น<br />
              เหมือนอยู่บ้าน เดิมทีหอพักแห่งนี้เป็นอาคารเก่าที่เคยใช้เป็น<br />
              โรงแรมขนาดเล็กก่อนถูกปรับปรุงใหม่ให้เหมาะสมกับการอยู่อาศัยระยะยาว<br />
              ในช่วงปีแรก หอพักมีนักศึกษาเข้าพักเพียง 40 คน<br />
              แต่ด้วยการบริหารจัดการที่ดีและสภาพแวดล้อมที่สะดวกสบาย<br />
              จำนวนผู้เข้าพักก็เพิ่มขึ้นเรื่อยๆ จนต้องขยายอาคารเพิ่มเติมในปี ค.ศ. 2025<br />
              โดยเพิ่มพื้นที่ส่วนกลาง เช่น ห้องอ่านหนังสือ ห้องดูหนัง และโรงอาหารขนาดเล็ก<br />
              ปัจจุบัน ไพน์เรสซิเดนซ์เป็นหนึ่งในหอพักเอกชนที่ได้รับความนิยมมากที่สุด<br />
              และยังคงยึดแนวคิดเดิมของเฟลด์แมน<br />
              นั่นคือ “ที่พักที่เป็นมากกว่าหอพัก แต่เป็นบ้านหลังที่สองของทุกคน”
            </p>
          </div>
        </div>
      </section>

      {/* ✅ กล่องสีเทาแยกออกมา ไม่กระทบความสูงรูป */}
      <div className="w-full h-[200px] bg-[#eeeeee]"></div>
    </>
  );
}
