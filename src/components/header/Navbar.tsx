import { useState } from 'react'
import AboutUsButton from '../buttons/AboutUsButton'
import BookingButton from '../buttons/BookingButton'
import RequestQuoteButton from '../buttons/RequestQuoteButton'
import TestimonialButton from '../buttons/TestimonialButton'
import BlogButton from '../buttons/BlogButton'
import LoginButton from '../buttons/LoginButton'
import ServiceButton from '../buttons/ServicesButton'
import { Menu, X } from 'lucide-react'
import Logo from '../../../public/new-logo.png'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  onBookNow: () => void
  onAboutUs: () => void
  onRequestQuote: () => void
  onTestimonial: () => void
}

export default function Navbar({
  onBookNow,
  onAboutUs,
  onRequestQuote,
  onTestimonial
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="relative z-20 px-4 sm:px-6 py-4 max-w-7xl mx-auto">

      {/* ── Glass pill container ── */}
      <div
        className="
          flex items-center justify-between
          px-4 sm:px-6 py-3
          rounded-2xl
          bg-white/10
          backdrop-blur-md
          border border-white/20
          shadow-[0_4px_24px_rgba(0,0,0,0.18)]
        "
      >
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center cursor-pointer shrink-0"
          aria-label="Go to homepage"
        >
          <img
            src={Logo}
            alt="Fantome Technologies Logo"
            className="h-10 w-auto rounded-xl"
          />
        </button>

        {/* Desktop Center Navigation */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <AboutUsButton onClick={onAboutUs} />
          <BookingButton onClick={onBookNow} />
          <RequestQuoteButton onClick={() => navigate('/request-quote')} />
          <TestimonialButton onClick={() => navigate('/testimonials')} />
          <ServiceButton onClick={() => navigate('/services')} />
          <BlogButton onClick={() => navigate('/blog')} />
        </div>

        {/* Right Side (Login Button Area) */}
        <div className="hidden md:flex items-center min-w-[120px] justify-end">
          {/* Future Employee Login Button Goes Here */}
          <LoginButton onClick={() => navigate('/login')} />
        </div>

        {/* Mobile Hamburger — black icon */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-black/10 transition"
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`
          md:hidden transition-all duration-300 ease-out overflow-hidden
          ${menuOpen ? 'max-h-screen opacity-100 mt-2' : 'max-h-0 opacity-0'}
        `}
      >
        <div
          className="
            flex flex-col gap-3
            bg-white/10 backdrop-blur-md
            border border-white/20
            shadow-[0_4px_24px_rgba(0,0,0,0.18)]
            rounded-2xl px-6 py-5 mt-1
          "
        >
          <AboutUsButton onClick={() => { setMenuOpen(false); onAboutUs() }} />
          <BookingButton onClick={() => { setMenuOpen(false); onBookNow() }} />
          <RequestQuoteButton onClick={() => { setMenuOpen(false); onRequestQuote() }} />
          <TestimonialButton onClick={() => { setMenuOpen(false); onTestimonial() }} />
          <ServiceButton onClick={() => { setMenuOpen(false); navigate('/services') }} />
          <BlogButton onClick={() => { setMenuOpen(false); navigate('/blog') }} />
          <LoginButton onClick={() => { setMenuOpen(false); navigate('/login') }} />
        </div>
      </div>

    </nav>
  )
}