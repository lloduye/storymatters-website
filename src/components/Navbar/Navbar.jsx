import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleNavClick = (path) => (e) => {
    e.preventDefault();
    setIsMenuActive(false);
    
    // First scroll to top
    window.scrollTo(0, 0);
    
    // Then navigate
    setTimeout(() => {
      navigate(path);
      // Force another scroll after navigation
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }, 0);
  };

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={handleNavClick('/')}>
        Story Matters Entertainment
      </Link>
      <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
        <Link to="/about-us" onClick={handleNavClick('/about-us')}>About Us</Link>
        <Link to="/our-work" onClick={handleNavClick('/our-work')}>Our Work</Link>
        <Link to="/programs" onClick={handleNavClick('/programs')}>Programs</Link>
        <Link to="/get-involved" onClick={handleNavClick('/get-involved')}>Get Involved</Link>
        <Link to="/news" onClick={handleNavClick('/news')}>News & Impact</Link>
        <Link to="/donate" className="donate-btn" onClick={handleNavClick('/donate')}>
          Support Us
        </Link>
      </nav>
      <div 
        className={`hamburger ${isMenuActive ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </header>
  );
};

export default Navbar;
