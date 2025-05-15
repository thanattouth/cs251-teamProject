import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  const images = [
    './hero-bg1.jpg',
    './hero-bg2.jpg',
    './hero-bg3.jpg',
    './hero-bg4.jpg',
  ]

  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [previewIndex, setPreviewIndex] = useState(0)

  const isAuthenticated = !!localStorage.getItem('token')

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length)
        setFade(true)
      }, 250)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const changeImage = (direction) => {
    setFade(false)
    setTimeout(() => {
      setIndex((prev) => (prev + direction + images.length) % images.length)
      setFade(true)
    }, 250)
  }

  return (
    <section id="home" className="relative w-full h-[90vh] overflow-hidden bg-cover bg-center mb-32">
      <img
        src={images[index]}
        alt="Dorm Slide"
        className={`absolute w-full h-full object-cover transition-opacity duration-700 ${fade ? 'opacity-40' : 'opacity-0'}`}
      />

      {/* Arrows */}
      <button
        onClick={() => changeImage(-1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/70 rounded-full flex items-center justify-center shadow hover:bg-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6 rotate-180">
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke="black" strokeWidth="2" />
        </svg>
      </button>

      <button
        onClick={() => changeImage(1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/70 rounded-full flex items-center justify-center shadow hover:bg-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke="black" strokeWidth="2" />
        </svg>
      </button>

      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="bg-white/0 border-[5px] border-black rounded-[32px] px-20 py-12 text-center">
          <h1 className="font-inter text-[64px] md:text-[96px] font-semibold mb-8 text-black">Dormitory Hub</h1>

          {/* แสดงปุ่มเฉพาะเมื่อยังไม่ login */}
          {!isAuthenticated && (
            <div className="relative w-[474px] h-[88px] mx-auto">
              <div className="absolute left-0 top-0 w-[474px] h-[88px] border-5 border-white rounded-full z-0"></div>

              <Link
                to="/signin"
                className="absolute left-0 top-0 w-[200px] h-[88px] text-[32px] font-normal bg-transparent rounded-[30px] z-10 hover:bg-white/30 transition flex items-center justify-center text-black"
              >
                sign in
              </Link>

              <Link
                to="/signup"
                className="absolute right-0 top-0 w-[274px] h-[88px] text-[32px] font-normal bg-white rounded-[30px] border-[5px] border-white z-20 shadow-sm hover:bg-gray-100 transition -ml-6 flex items-center justify-center text-black"
              >
                sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
