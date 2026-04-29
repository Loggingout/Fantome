import { AnimatePresence } from "motion/react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/scroll/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import ServicePage from "./pages/ServicesPage";
import RequestQuotePage from "./pages/RequestQuotePage";
import FourOFourPage from './pages/FourOFourPage';
import TestimonialPage from './pages/TestimonialPage';

function App() {
  return (
    <AnimatePresence>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/request-quote" element={<RequestQuotePage />} />
        <Route path="/FourOFour" element={<FourOFourPage />} />
        <Route path="/testimonials" element={<TestimonialPage />} />
        {/* Add more routes here as you build more pages */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
