import React from 'react';

const ContactSection = () => {
  return (
    <section className="text-white bg-black w-full">
      {/* Banner */}
      <div
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/DormitoryBG.jpg)' }}
      >
         <h1 className="text-4xl border-2 px-6 py-2 text-center text-white">CONTACT US</h1>
      </div>

      {/* Map & Contact */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-8 bg-white text-black">
        <img
          src="/map.png"
          alt="Map"
          className="w-full md:w-1/2 rounded-lg shadow-md"
        />
        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-lg w-full md:w-1/3">
          <p><strong>Address :</strong> Maccurach building a<br />Bangkok, Bang Bon 10160</p>
          <p className="mt-4"><strong>Tel :</strong> 077-777-7777</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
