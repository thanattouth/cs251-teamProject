import React from 'react'
import BookingSection from '../components/BookingSection';
import ContactSection from '../components/ContactSection';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';

function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <BookingSection />
      <ContactSection />
    </div>
  )
}

export default Home