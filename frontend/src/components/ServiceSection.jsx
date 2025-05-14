import React from 'react'

const services = [
  { label: 'Check-In / Out', img: '/checkin.jpg' },
  { label: 'Payment', img: '/payment.jpg' },
  { label: 'Maintenance Request', img: '/report.jpg' },
  { label: 'Reviews', img: '/reviews.jpg' },
]

const ServiceSection = () => {
  return (
    <section id="Service" className="bg-[#ededed] text-gray-800 py-24 pb-36">
      
      {/* Section Title */}
      <div className="text-center mb-16">
        <h3 className="text-4xl font-serif text-[#1e1e2f] mb-2">dormitory</h3>
        <h2 className="text-7xl font-extrabold text-[#428fe0] drop-shadow">SERVICES</h2>
      </div>

      {/* Service Grid (4 boxes) */}
      <div className="flex justify-center flex-wrap gap-14 mb-20 px-6">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-70 h-76 bg-white rounded-md shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={service.img}
                alt={service.label}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-4 text-center text-lg font-medium">{service.label}</p>
          </div>
        ))}
      </div>

      {/* Q&A and Map */}
      <section className="w-full py-20 bg-[#f6f7f7] px-6 flex flex-col lg:flex-row justify-center gap-16">
  
  {/* Q&A Box */}
  <div className="w-full lg:w-[50%] pl-6 lg:pl-25">
    <div className="flex">
      {/* เส้นแนวตั้ง */}
      <div className="border-l-4 border-black mr-6"></div>

      {/* เนื้อหา Q&A */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-widest text-black mb-4">Q&A</h2>

        <div className="text-[#333] font-medium space-y-4 text-base">
          <div>
            <p className="mb-2"><strong>Q:</strong> การจองล่วงหน้า</p>
            <p><strong>A:</strong> คุณสามารถจองล่วงหน้าได้สูงสุด 6 เดือน ขึ้นอยู่กับประเภทของห้องและช่วงเวลาที่ต้องการเข้าพัก</p>
          </div>

          <div>
            <p className="mb-2"><strong>Q:</strong> ช่องทางชำระเงิน</p>
            <p><strong>A:</strong> รองรับการโอนเงิน, บัตรเครดิต และ e-Wallet</p>
          </div>

          <div>
            <p className="mb-2"><strong>Q:</strong> เวลาเช็คอิน/เช็คเอาท์</p>
            <p><strong>A:</strong> เช็คอิน: 14:00 - 20:00 / เช็คเอาท์: ก่อนเวลา 12:00</p>
          </div>

          <div>
            <p className="mb-2"><strong>Q:</strong> บริการทำความสะอาด</p>
            <p><strong>A:</strong> มีบริการ พร้อมแจ้งล่วงหน้า และมีค่าใช้จ่ายเพิ่มเติม</p>
          </div>

          <div>
            <p className="mb-2"><strong>Q:</strong> มี Wi-Fi ให้ใช้ฟรีหรือไม่?</p>
            <p><strong>A:</strong> มี Wi-Fi ฟรีสำหรับผู้พักอาศัยทุกคน</p>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-red-400 font-bold">📩 ต้องการสอบถามเพิ่มเติม?</p>
          <p className="text-sm">[09x-xxx-xxx / Dormitory@gmail.com / @Dormitory]</p>
        </div>
      </div>
    </div>
  </div>

  {/* MAP Box (เหมือนเดิม ไม่เปลี่ยน) */}
  <div className="w-full lg:w-[50%] relative flex justify-center items-start">

    {/* กล่องน้ำตาล - ขยับขวา */}
    <div className="bg-[#5c442a] w-[500px] h-[320px] absolute top-30 left-32 z-0">
    </div>

    {/* กล่องสีเนื้อที่ใส่รูป */}
    <div className="bg-[#f7f0e7] w-[550px] h-[320px] z-10 relative overflow-hidden top-20">
      <div className="absolute inset-0 bg-black/10 z-10" />
      <img
        src="./map2.png"
        alt="Map"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</section>

    </section>
  )
}

export default ServiceSection
