import { Link } from "react-router-dom";
import Logo from "/new-logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src={Logo}
              alt="Fantome Technologies Logo"
              className="h-12 w-auto rounded-xl mb-4"
            />
            <p className="text-gray-600 max-w-sm">
              Fantome Technologies builds modern, high-quality websites and
              landing pages designed to grow your business.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-purple-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-purple-600">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/FourOFour" className="hover:text-purple-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/testimonials" className="hover:text-purple-600">
                    Read Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/services" className="hover:text-purple-600">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-purple-600">
                    Landing Pages
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-purple-600">
                    Website Redesigns
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Email</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link
                    to="mailto:fantometechnologies@gmail.com"
                    className="hover:text-purple-600"
                  >
                    fantometechnologies@gmail.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Fantome Technologies. All rights
            reserved.
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <span className="text-sm text-gray-500">Powered by</span>
            <img
              src="/new-logo.png"
              alt="Fantome Technologies"
              className="h-5 w-auto opacity-90"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
