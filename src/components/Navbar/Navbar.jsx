import React from "react"
import './Navbar.css'

const Navbar = (props) => {
  return (
    <header className="header">
      <a href="" className="logo">Logo</a>
      <nav className="navbar">
        <a href="">What we do</a>
        <a href="">Where we work</a>
        <a href="">About us</a>
        <a href="">News & Updates</a>
        <a href="">Donate</a>
      </nav>
      
    </header>
  )
};

export default Navbar;
