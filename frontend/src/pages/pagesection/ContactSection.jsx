import React from 'react';

const ContactSection = () => {
  return (
    <footer className="bg-[#1e294f] text-white py-10 px-6 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Column 1: Help message */}
        <div>
          <h3 className="font-semibold mb-1">We're always here to help you...</h3>
          <p>Reach out to us through any of these support channels</p>
        </div>

        {/* Column 2: Hotline */}
        <div>
          <h3 className="font-semibold mb-1">Hotline:</h3>
          <p>+979 456 3456</p>
        </div>

        {/* Column 3: Email */}
        <div>
          <h3 className="font-semibold mb-1">Email:</h3>
          <p>support@dormitory.com</p>
        </div>

        {/* Column 4: Social icons */}
        <div>
          <h3 className="font-semibold mb-1">Connect with us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" aria-label="Facebook" className="hover:opacity-70">📘</a>
            <a href="#" aria-label="Instagram" className="hover:opacity-70">📸</a>
            <a href="#" aria-label="Twitter" className="hover:opacity-70">🐦</a>
            <a href="#" aria-label="Telegram" className="hover:opacity-70">✈️</a>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="text-center text-xs text-gray-300 border-t border-gray-700 pt-4">
        © 2025 Dormitory. All rights reserved | Powered by WebCulture
      </div>
    </footer>
  );
};

export default ContactSection;
