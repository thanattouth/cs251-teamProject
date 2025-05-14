import React, { useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import BookingSection from '../components/BookingSection'
import ContactSection from '../components/ContactSection'
import ServiceSection from '../components/ServiceSection'
import NewsActivitySection from '../components/NewActivitySection'

function Home() {
  useEffect(() => {
    const targetSection = localStorage.getItem('scrollToSection')
    if (targetSection) {
      const el = document.getElementById(targetSection)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
      localStorage.removeItem('scrollToSection')
    }
  }, [])

  return (
    <div>
      <HeroSection />
      <AboutSection />
      <div id="Service">
        <ServiceSection />
      </div>
      <div id="NewActivity">
        <NewsActivitySection />
      </div>
      <div id="reservation">
        <BookingSection />
      </div>
      <ContactSection />
    </div>
  )
}

export default Home
