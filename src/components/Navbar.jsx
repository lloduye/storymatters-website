import React from "react"

const Navbar = (props) => {
  return (
    <nav>
      <a href="/">Portfolio</a>
      <div>
        <ul>
            <li><a href="#about"></a>About</li>
            <li><a href="#ourwork"></a>Our Work</li>
            <li><a href="#stories"></a>Stories</li>
            <li><a href="#donate"></a>Donate</li>
        </ul>
      </div>
    </nav>
  )
};

export default Navbar;
