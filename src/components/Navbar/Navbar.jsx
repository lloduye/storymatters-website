import React, { useState } from "react"
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Story Matters</Link>
      <nav className={`navbar ${isMenuActive ? 'active' : ''}`}>
        <Link to="/about-us">About Us</Link>
        <Link to="/our-work">Our Work</Link>
        <Link to="/programs">Programs</Link>
        <Link to="/get-involved">Get Involved</Link>
        <Link to="/news">News & Impact</Link>
        <Link to="/donate" className="donate-btn">Support Us</Link>
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
