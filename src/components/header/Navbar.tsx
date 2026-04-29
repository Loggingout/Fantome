import { useState } from 'react'
import AboutUsButton from '../buttons/AboutUsButton'
import BookingButton from '../buttons/BookingButton'
import RequestQuoteButton from '../buttons/RequestQuoteButton'
import TestimonialButton from '../buttons/TestimonialButton'
import { Menu, X } from 'lucide-react'
import Logo from '../../../public/new-logo.png'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  onBookNow: () => void
  onAboutUs: () => void
  onRequestQuote: () => void
  onTestimonial: () => void
}

export default function Navbar({ onBookNow, onAboutUs, onRequestQuote, onTestimonial }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();

  return (
    <nav className="relative z-20 px-8 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Fantome Technologies Logo" className="h-12 w-auto rounded-2xl" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Fantome Technologies
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <AboutUsButton onClick={onAboutUs} />
          <BookingButton onClick={onBookNow} />
          <RequestQuoteButton onClick={() => navigate('/request-quote')} />
          <TestimonialButton onClick={() => navigate('/testimonials')} />
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <X className="w-7 h-7 text-purple-600" />
          ) : (
            <Menu className="w-7 h-7 text-purple-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-out overflow-hidden
          ${menuOpen ? 'max-h-screen opacity-100 mt-6' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="flex flex-col gap-4 bg-transparent rounded-2xl p-6">
          <AboutUsButton
            onClick={() => {
              setMenuOpen(false)
              onAboutUs()
            }}
          />
          <BookingButton
            onClick={() => {
              setMenuOpen(false)
              onBookNow()
            }}
          />
          <RequestQuoteButton
            onClick={() => {
              setMenuOpen(false)
              onRequestQuote()
            }}
          />
          <TestimonialButton
            onClick={() => {
              setMenuOpen(false)
              onTestimonial()
            }}
          />
        </div>
      </div>
    </nav>
  )
}
