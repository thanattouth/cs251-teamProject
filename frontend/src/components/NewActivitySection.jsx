import React from "react";

const NewsActivitySection = () => {
  const activityLabels = ["Fitness", "Library", "Game Room", "Cooking"];
  const activityImages = ["/fitness.jpg", "/library.png", "/game.jpg", "/cooking.jpg"];

  return (
    <section id="NewActivity" className="bg-[#f5f6f6] w-full relative pb-80">
      {/* Top bar with brown background */}
      <div className="bg-[#95866f] px-10 h-[280px] flex items-start relative z-0">
        <h2 className="text-6xl italic font-[750] text-[#261b0b] mt-35 ml-28">
          FOLLOW THE NEWS
        </h2>
      </div>

      <div className="absolute right-15 top-[165px] z-20 flex flex-col items-end gap-0">
        {/* กล่องหัวข้อ Activity */}
        <div className="absolute right-[120px] top-[10px] z-10">
          <div className="bg-[#f3f2eb] px-10 py-2 text-[40px] italic font-normal w-[300px] text-center shadow">
            Activity
          </div>
        </div>

        {/* กล่องกิจกรรมแต่ละอัน */}
        {activityImages.map((img, i) => (
          <div
            key={i}
            className={`relative mt-4 z-30 ${i % 2 === 0 ? "translate-x-0" : "-translate-x-60"}`}
          >
            <div className="bg-[#382c1f] w-[200px] h-[200px] absolute -top-[10px] left-[12px] -z-10"></div>
            <div className="bg-[#5b472a] w-[180px] h-[180px] flex items-center justify-center overflow-hidden">
              <img src={img} alt="activity" className="w-full h-full object-cover" />
            </div>
            <p className="absolute -bottom-5 left-0 bg-white px-4 py-1 shadow text-[#2e3440] text-sm font-bold italic tracking-wider z-30">
              {activityLabels[i]}
            </p>
          </div>
        ))}
      </div>

      <div className="pl-36 pr-10 -mt-15 flex flex-row gap-40 z-10 relative">
  {/* กล่องข่าวที่ 1 (เหมือนเดิม) */}
  <div className="text-center">
    <div className="w-[400px] h-[300px] border-[10px] border-[#382c1f] bg-white">
      <img src="/studyzone.jpg" alt="News" className="w-full h-full object-cover" />
    </div>
    <h3 className="mt-8 text-2xl font-bold">📚 Study Zone</h3>
    <p className="text-lg">ห้องอ่านหนังสือโซนใหม่</p>
    <p className="text-lg">ชั้น 2 เปิดให้บริการ</p>
    <p className="text-lg text-black">ขอความกรุณาทุกท่านโปรดรักษาความสงบ 🙏</p>
  </div>

  {/* กล่องข่าวที่ 2 (ประกาศห้ามส่งเสียงดัง) */}
  <div className="text-center">
    <div className="w-[400px] h-[300px] border-[10px] border-[#382c1f] bg-white">
      <img src="/gym.jpg" alt="Notice" className="w-full h-full object-cover" />
    </div>
    <h3 className="mt-8 text-2xl mr-5 font-bold text-black">🎉 New Facilities</h3>
    <p className="text-lg text-[#333]">
    ห้องฟิตเนสเปิดให้ใช้งานแล้วทุกวัน
    </p>
    <p className="text-lg text-[#333]">เวลา 6:00 - 22:00</p>
    <p className="text-lg text-black">ผู้เข้าพักทุกท่านสามารถเข้าใช้ได้ 🙏</p>
  </div>
</div>
    </section>
  );
};

export default NewsActivitySection;
