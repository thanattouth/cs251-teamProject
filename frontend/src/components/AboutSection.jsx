import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-[#636161] text-white px-15 py-16">
      <h2 className="text-3xl font-semibold underline underline-offset-8 decoration-white mb-8">About Us</h2>

      <div className="flex flex-col md:flex-row items-start">
        {/* ส่วนข้อความ */}
        <div className="md:w-1/2 pl-4 md:pl-32">
          <h3 className="text-2xl font-semibold mb-4 underline underline-offset-4 decoration-white">History</h3>
          <p className="leading-relaxed text-lg">
          หอพักก่อตั้งขึ้นเมื่อปี ค.ศ. 2025<br />
          ซึ่งมีแนวคิดที่จะสร้างที่พักสำหรับนักศึกษาที่ให้บรรยากาศอบอุ่น<br />
          เหมือนอยู่บ้าน เดิมทีหอพักแห่งนี้เป็นอาคารเก่าที่เคยใช้เป็น<br />
          โรงแรมขนาดเล็กก่อนถูกปรับปรุงใหม่ให้เหมาะสม<br />
          กับการอยู่อาศัยระยะยาว<br />
          ในช่วงปีแรก หอพักมีนักศึกษาเข้าพักเพียง 40 คน<br />
          แต่ด้วยการบริหารจัดการที่ดีและสภาพแวดล้อมที่สะดวกสบาย<br />
          จำนวนผู้เข้าพักก็เพิ่มขึ้นเรื่อยๆ จนต้องขยายอาคารเพิ่มเติมในปี<br />
          ค.ศ. 2025 โดยเพิ่มพื้นที่ส่วนกลาง<br />
          เช่น ห้องอ่านหนังสือ ห้องดูหนัง และโรงอาหารขนาดเล็ก<br />
          ปัจจุบัน ไพน์เรสซิเดนซ์เป็นหนึ่งในหอพักเอกชนที่ได้รับความนิยมมากที่สุด<br />
          และยังคงยึดแนวคิดเดิมของเฟลด์แมน<br />
          นั่นคือ “ที่พักที่เป็นมากกว่าหอพัก แต่เป็นบ้านหลังที่สองของทุกคน”
          </p>
        </div>

        {/* ส่วนรูปภาพ */}
        <div className="md:w-1/2">
          <img src="./hero-bg-about.png" alt="Dormitory Building" className="rounded-md w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
