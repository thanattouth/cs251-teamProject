import React, { useEffect } from 'react'
import HeroSection from './pagesection/HeroSection'
import AboutSection from './pagesection/AboutSection'
import BookingSection from './pagesection/BookingSection'
import ContactSection from './pagesection/ContactSection'
import ServiceSection from './pagesection/ServiceSection'
import NewsActivitySection from './pagesection/NewActivitySection'

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
