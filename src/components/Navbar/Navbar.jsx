import React, { useState } from "react"
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleLinkClick = () => {
    setIsMenuActive(false);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Story Matters</Link>
      <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
        <Link to="/about-us" onClick={handleLinkClick}>About Us</Link>
        <Link to="/our-work" onClick={handleLinkClick}>Our Work</Link>
        <Link to="/programs" onClick={handleLinkClick}>Programs</Link>
        <Link to="/get-involved" onClick={handleLinkClick}>Get Involved</Link>
        <Link to="/news" onClick={handleLinkClick}>News & Impact</Link>
        <Link to="/donate" className="donate-btn" onClick={handleLinkClick}>Support Us</Link>
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
